import { defineEventHandler, readBody, setCookie, getHeader, createError } from 'h3';
import { getDb } from '../../utils/db';

export default defineEventHandler(async (event) => {
  const body = await readBody(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Request body required' });
  }

  const expectedKey = process.env.ADMIN_PASSWORD || process.env.ADMIN_API_KEY || process.env.ADMIN_SECRET;

  const proto = getHeader(event, 'x-forwarded-proto');
  const host = getHeader(event, 'host') || '';
  const isHttps = proto === 'https';
  const isLocal = host.includes('localhost') || host.includes('127.0.0.1');
  const cookieSecure = isHttps || (process.env.NODE_ENV === 'production' && !isLocal && process.env.ALLOW_INSECURE_COOKIES !== 'true');

  // 1. Admin Passcode / Key verification
  const password = body.password || body.apiKey;
  if (password && expectedKey && password === expectedKey) {
    setCookie(event, 'admin_auth', expectedKey, {
      httpOnly: true,
      secure: cookieSecure,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });
    return {
      success: true,
      user: { name: 'Site Administrator', role: 'admin' },
    };
  }

  // 2. Neon Auth token verification (if passed from Neon Auth client)
  if (body.sessionToken) {
    try {
      const sql = getDb();
      const rows = await sql`
        SELECT s.id, s.token, s."expiresAt", u.name, u.email
        FROM neon_auth.session s
        JOIN neon_auth."user" u ON s."userId" = u.id
        WHERE s.token = ${body.sessionToken} AND s."expiresAt" > NOW()
        LIMIT 1
      `;
      if (rows.length > 0) {
        setCookie(event, 'neon_session', body.sessionToken, {
          httpOnly: true,
          secure: cookieSecure,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/',
        });
        return {
          success: true,
          user: { name: rows[0].name || rows[0].email, email: rows[0].email, role: 'admin' },
        };
      }
    } catch (err) {
      console.error('Neon Auth verification error:', err);
    }
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Invalid Admin passcode or Neon Auth session',
  });
});
