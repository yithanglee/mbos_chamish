import crypto from 'node:crypto';
import type { H3Event } from 'h3';
import { getHeader } from 'h3';

function getSecret(): string {
  return process.env.ADMIN_PASSWORD || process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET || 'mbos_ai_agent_secret_key';
}

export function getBaseUrl(event?: H3Event): string {
  if (process.env.MCP_OAUTH_RESOURCE) {
    try {
      const url = new URL(process.env.MCP_OAUTH_RESOURCE);
      return url.origin;
    } catch {}
  }
  if (event) {
    const host = getHeader(event, 'x-forwarded-host') || getHeader(event, 'host') || 'mbos.com.my';
    const proto = getHeader(event, 'x-forwarded-proto') || (host.includes('localhost') ? 'http' : 'https');
    return `${proto}://${host}`;
  }
  return 'https://mbos.com.my';
}

function base64UrlEncode(data: Buffer | string): string {
  const buf = typeof data === 'string' ? Buffer.from(data, 'utf-8') : data;
  return buf.toString('base64').replace(/=/g, '').replace(/\+/g, '-').replace(/\//g, '_');
}

function base64UrlDecode(str: string): Buffer {
  let base64 = str.replace(/-/g, '+').replace(/_/g, '/');
  while (base64.length % 4 !== 0) {
    base64 += '=';
  }
  return Buffer.from(base64, 'base64');
}

/**
 * Sign an authorization code containing flow details (stateless).
 */
export function createAuthorizationCode(data: {
  clientId: string;
  redirectUri: string;
  codeChallenge?: string;
  codeChallengeMethod?: string;
  scope?: string;
}): string {
  const secret = getSecret();
  const payload = JSON.stringify({
    ...data,
    exp: Math.floor(Date.now() / 1000) + 600, // 10 minutes
    nonce: crypto.randomUUID(),
  });
  const encodedPayload = base64UrlEncode(payload);
  const signature = crypto.createHmac('sha256', secret).update(encodedPayload).digest();
  return `${encodedPayload}.${base64UrlEncode(signature)}`;
}

/**
 * Verify an authorization code.
 */
export function verifyAuthorizationCode(code: string, codeVerifier?: string): {
  valid: boolean;
  clientId?: string;
  redirectUri?: string;
  scope?: string;
  error?: string;
} {
  try {
    const secret = getSecret();
    const [encodedPayload, encodedSig] = code.split('.');
    if (!encodedPayload || !encodedSig) return { valid: false, error: 'Malformed code' };

    const expectedSig = crypto.createHmac('sha256', secret).update(encodedPayload).digest();
    const actualSig = base64UrlDecode(encodedSig);

    if (expectedSig.length !== actualSig.length || !crypto.timingSafeEqual(expectedSig, actualSig)) {
      return { valid: false, error: 'Invalid code signature' };
    }

    const payload = JSON.parse(base64UrlDecode(encodedPayload).toString('utf-8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return { valid: false, error: 'Authorization code expired' };
    }

    // Verify PKCE if present
    if (payload.codeChallenge) {
      if (!codeVerifier) {
        return { valid: false, error: 'Missing code_verifier for PKCE' };
      }
      const method = payload.codeChallengeMethod || 'plain';
      let challenge = codeVerifier;
      if (method === 'S256') {
        challenge = base64UrlEncode(crypto.createHash('sha256').update(codeVerifier).digest());
      }
      if (challenge !== payload.codeChallenge) {
        return { valid: false, error: 'Invalid code_verifier' };
      }
    }

    return {
      valid: true,
      clientId: payload.clientId,
      redirectUri: payload.redirectUri,
      scope: payload.scope,
    };
  } catch (err: any) {
    return { valid: false, error: err.message };
  }
}

/**
 * Sign an OAuth Bearer access token (stateless HS256 JWT).
 */
export function createAccessToken(sub = 'admin', scope = 'all products:read products:write design:write homepage:write'): string {
  const secret = getSecret();
  const header = base64UrlEncode(JSON.stringify({ alg: 'HS256', typ: 'JWT' }));
  const payload = base64UrlEncode(JSON.stringify({
    sub,
    iss: 'https://mbos.com.my',
    aud: 'https://mbos.com.my/api/mcp',
    scope,
    iat: Math.floor(Date.now() / 1000),
    exp: Math.floor(Date.now() / 1000) + 86400 * 90, // 90 days
  }));
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${payload}`).digest();
  return `${header}.${payload}.${base64UrlEncode(signature)}`;
}

/**
 * Verify a Bearer token or API key.
 */
export function verifyAccessToken(token: string): {
  valid: boolean;
  sub?: string;
  scopes: Set<string>;
} {
  const empty = new Set<string>();
  const secret = getSecret();

  // 1. Direct API Key check
  if (token === secret) {
    return {
      valid: true,
      sub: 'admin',
      scopes: new Set(['all', 'openid', 'email', 'products:read', 'products:write', 'design:write', 'homepage:write']),
    };
  }

  // 2. Local HS256 JWT check
  try {
    const parts = token.split('.');
    if (parts.length === 3) {
      const [headerB64, payloadB64, sigB64] = parts;
      const expectedSig = crypto.createHmac('sha256', secret).update(`${headerB64}.${payloadB64}`).digest();
      const actualSig = base64UrlDecode(sigB64);

      if (expectedSig.length === actualSig.length && crypto.timingSafeEqual(expectedSig, actualSig)) {
        const payload = JSON.parse(base64UrlDecode(payloadB64).toString('utf-8'));
        const now = Math.floor(Date.now() / 1000);
        if (!payload.exp || payload.exp >= now) {
          const scopeList = (payload.scope || 'all').split(/\s+/);
          return {
            valid: true,
            sub: payload.sub || 'admin',
            scopes: new Set(scopeList),
          };
        }
      }
    }
  } catch {}

  return { valid: false, scopes: empty };
}
