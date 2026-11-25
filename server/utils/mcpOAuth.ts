import { createPublicKey, verify } from 'node:crypto';
import { getHeader, type H3Event } from 'h3';
import { getDb } from './db';
import { verifyAccessToken, getBaseUrl } from './selfOAuth';

export function mcpOAuthConfig(event?: H3Event) {
  const issuer = (process.env.MCP_OAUTH_ISSUER || process.env.NEON_AUTH_BASE_URL)?.replace(/\/$/, '') || (event ? getBaseUrl(event) : 'https://mbos.com.my');
  const resource = process.env.MCP_OAUTH_RESOURCE || `${event ? getBaseUrl(event) : 'https://mbos.com.my'}/api/mcp`;

  return {
    issuer,
    resource,
    jwksUrl: `${issuer}/.well-known/jwks.json`,
    metadata: `${event ? getBaseUrl(event) : 'https://mbos.com.my'}/.well-known/oauth-protected-resource`,
  };
}

function decode(segment: string) {
  if (!/^[A-Za-z0-9_-]+$/.test(segment)) throw new Error('Invalid JWT encoding');
  if (segment.length % 4 === 1) throw new Error('Invalid JWT encoding');
  return Buffer.from(segment, 'base64url');
}

export async function mcpOAuthScopes(event: H3Event, checkDesignAccess = false): Promise<Set<string>> {
  const token = getHeader(event, 'authorization')?.match(/^Bearer (\S+)$/i)?.[1] ||
                getHeader(event, 'x-api-key');

  if (!token) return new Set();

  // 1. Check self-hosted OAuth token or direct Admin API Key first
  const localAuth = verifyAccessToken(token);
  if (localAuth.valid) {
    return localAuth.scopes;
  }

  // 2. Fallback to external Neon Auth / OIDC JWT if configured
  const config = mcpOAuthConfig(event);
  const scopes = new Set<string>();
  const reject = (reason: string) => {
    console.warn('MCP OAuth rejected:', reason);
    return scopes;
  };

  if (!config || !config.issuer.includes('neon')) {
    return scopes;
  }

  if (token.length > 16384) return reject('token_too_long');

  let stage = 'jwt_decode';
  try {
    const segments = token.split('.');
    if (segments.length !== 3) return reject('not_jwt');
    const [header, payload, signature] = segments;
    const decoder = new TextDecoder();
    const { alg, kid, crit } = JSON.parse(decoder.decode(decode(header)));
    if (typeof kid !== 'string' || crit !== undefined) return reject('invalid_header');

    if (alg !== 'EdDSA' && alg !== 'RS256') return reject('unsupported_algorithm');

    const claims = JSON.parse(decoder.decode(decode(payload)));
    const now = Date.now() / 1000;
    const audiences = Array.isArray(claims.aud) ? claims.aud : [claims.aud];
    if (claims.iss !== config.issuer) return reject('issuer_mismatch');
    if (!audiences.includes(config.resource)) return reject('audience_mismatch');
    if (!Number.isFinite(claims.exp) || claims.exp <= now ||
        (claims.nbf !== undefined && (!Number.isFinite(claims.nbf) || claims.nbf > now)) ||
        typeof claims.sub !== 'string' || !claims.sub ||
        typeof claims.scope !== 'string') return reject('invalid_claims');

    stage = 'jwks_fetch';
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 5000);
    let keys: (JsonWebKey & { kid?: string })[];
    try {
      const response = await fetch(config.jwksUrl, {
        redirect: 'manual',
        signal: controller.signal,
      });
      if (!response.ok) return reject('jwks_http_' + response.status);
      stage = 'jwks_decode';
      ({ keys } = await response.json());
      if (!Array.isArray(keys)) return reject('invalid_jwks');
    } finally {
      clearTimeout(timeout);
    }
    const matches = keys.filter(key => key.kid === kid && (!key.alg || key.alg === alg) &&
      (!key.use || key.use === 'sig') && (alg === 'EdDSA'
        ? key.kty === 'OKP' && key.crv === 'Ed25519'
        : key.kty === 'RSA'));
    if (matches.length !== 1) return reject('signing_key_mismatch');

    stage = 'key_import';
    const key = createPublicKey({ key: matches[0], format: 'jwk' });
    stage = 'signature_verify';
    const verified = verify(alg === 'EdDSA' ? null : 'RSA-SHA256',
      Buffer.from(`${header}.${payload}`), key, decode(signature));
    if (!verified) return reject('invalid_signature');

    const granted = new Set(claims.scope.split(/\s+/));
    if (granted.has('openid') || granted.has('products:read')) scopes.add('products:read');
    const writers = (process.env.MCP_OAUTH_WRITE_SUBJECTS || '').split(',').map(value => value.trim());
    if (granted.has('products:write') && writers.includes(claims.sub)) scopes.add('products:write');
    
    // Check design access
    if (checkDesignAccess) {
      const editors = ['damien@robugroup.com', 'yithanglee@gmail.com', 'calvin@mbos.com.my', 'calvintan@mbos.com.my'];
      if (typeof claims.email === 'string' && editors.includes(claims.email.toLowerCase())) {
        scopes.add('design:write');
      } else {
        try {
          const sql = getDb();
          const users = await sql`
            SELECT email, "emailVerified"
            FROM neon_auth."user"
            WHERE id = ${claims.sub}
            LIMIT 1
          `;
          const identity = users[0];
          if (identity?.emailVerified === true && typeof identity.email === 'string' &&
              editors.includes(identity.email.toLowerCase())) {
            scopes.add('design:write');
          }
        } catch {
          console.warn('MCP OAuth design identity lookup failed');
        }
      }
    }
    if (scopes.size === 0) return reject('no_catalog_scope');
    return scopes;
  } catch {
    return reject(stage + '_error');
  }
}
