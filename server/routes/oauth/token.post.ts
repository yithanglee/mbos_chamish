import { defineEventHandler, readBody, createError, setResponseHeader } from 'h3';
import { verifyAuthorizationCode, createAccessToken } from '../../utils/selfOAuth';

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Access-Control-Allow-Origin', '*');
  setResponseHeader(event, 'Access-Control-Allow-Methods', 'POST, OPTIONS');
  setResponseHeader(event, 'Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (event.method === 'OPTIONS') {
    return '';
  }

  const body = await readBody(event).catch(() => ({}));
  const grantType = body.grant_type || 'authorization_code';

  if (grantType === 'authorization_code') {
    const code = body.code;
    const codeVerifier = body.code_verifier;

    if (!code) {
      throw createError({ statusCode: 400, statusMessage: 'Missing code parameter' });
    }

    const verification = verifyAuthorizationCode(code, codeVerifier);
    if (!verification.valid) {
      throw createError({ statusCode: 400, statusMessage: verification.error || 'Invalid authorization code' });
    }

    const scope = verification.scope || 'all products:read products:write design:write homepage:write';
    const accessToken = createAccessToken('admin', scope);

    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 86400 * 90,
      scope,
    };
  }

  if (grantType === 'refresh_token') {
    const accessToken = createAccessToken('admin', 'all products:read products:write design:write homepage:write');
    return {
      access_token: accessToken,
      token_type: 'Bearer',
      expires_in: 86400 * 90,
      scope: 'all products:read products:write design:write homepage:write',
    };
  }

  throw createError({ statusCode: 400, statusMessage: `Unsupported grant_type: ${grantType}` });
});
