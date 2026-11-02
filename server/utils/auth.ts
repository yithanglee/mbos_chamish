import type { H3Event } from 'h3';
import { getHeader, getCookie, createError } from 'h3';
import { getDb } from './db';

export interface AuthContext {
  type: 'agent' | 'user';
  name: string;
  email?: string;
  role: 'admin';
}

function getExpectedApiKey(): string {
  return process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET || 'mbos_ai_agent_secret_key';
}

export async function verifyAuth(event: H3Event): Promise<AuthContext | null> {
  // 1. Check API Key header (X-API-Key or Authorization: Bearer <key>)
  const apiKeyHeader = getHeader(event, 'x-api-key');
  const authHeader = getHeader(event, 'authorization');
  let providedKey = apiKeyHeader;

  if (!providedKey && authHeader && authHeader.startsWith('Bearer ')) {
    providedKey = authHeader.slice(7).trim();
  }

  const expectedKey = getExpectedApiKey();
  if (providedKey && providedKey === expectedKey) {
    return {
      type: 'agent',
      name: 'AI Agent / Automation',
      role: 'admin',
    };
  }

  // 2. Check Neon Auth / Session Cookie
  const sessionToken = getCookie(event, 'neon_session') || getCookie(event, 'better-auth.session_token') || providedKey;
  if (sessionToken) {
    try {
      const sql = getDb();
      const rows = await sql`
        SELECT s.id, s.token, s."expiresAt", u.id AS user_id, u.name, u.email
        FROM neon_auth.session s
        JOIN neon_auth."user" u ON s."userId" = u.id
        WHERE s.token = ${sessionToken} AND s."expiresAt" > NOW()
        LIMIT 1
      `;
      if (rows && rows.length > 0) {
        return {
          type: 'user',
          name: rows[0].name || rows[0].email,
          email: rows[0].email,
          role: 'admin',
        };
      }
    } catch (err) {
      // In case neon_auth schema is querying or table empty
    }
  }

  // 3. Fallback admin password cookie for web UI
  const adminCookie = getCookie(event, 'admin_auth');
  if (adminCookie && adminCookie === expectedKey) {
    return {
      type: 'user',
      name: 'Site Administrator',
      role: 'admin',
    };
  }

  return null;
}

export async function requireAuth(event: H3Event): Promise<AuthContext> {
  const auth = await verifyAuth(event);
  if (!auth) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized: Valid Admin API Key or Neon Auth session required',
    });
  }
  return auth;
}
