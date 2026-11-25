import { defineEventHandler, readBody, sendRedirect, setCookie, createError } from 'h3';
import { createAuthorizationCode } from '../../utils/selfOAuth';

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const password = body.password || '';
  const clientId = body.client_id || 'chatgpt';
  const redirectUri = body.redirect_uri || '';
  const state = body.state || '';
  const codeChallenge = body.code_challenge || undefined;
  const codeChallengeMethod = body.code_challenge_method || undefined;
  const scope = body.scope || 'all products:read products:write design:write homepage:write';

  const expectedPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_API_KEY || 'mbos_ai_agent_secret_key';

  if (!password || password !== expectedPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid Admin Password' });
  }

  // Set admin cookie so future visits are seamless
  setCookie(event, 'admin_auth', expectedPassword, {
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 86400 * 30,
    path: '/',
  });

  if (!redirectUri) {
    return { success: true, message: 'Authorized successfully. You can return to ChatGPT.' };
  }

  const code = createAuthorizationCode({
    clientId,
    redirectUri,
    codeChallenge,
    codeChallengeMethod,
    scope,
  });

  const redirectUrl = new URL(redirectUri);
  redirectUrl.searchParams.set('code', code);
  if (state) redirectUrl.searchParams.set('state', state);

  return sendRedirect(event, redirectUrl.toString(), 302);
});
