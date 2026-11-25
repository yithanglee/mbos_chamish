import { defineEventHandler, readBody, setResponseStatus } from 'h3';
import crypto from 'node:crypto';

export default defineEventHandler(async (event) => {
  const body = await readBody(event).catch(() => ({}));
  const clientId = body.client_id || `mcp_client_${crypto.randomBytes(8).toString('hex')}`;
  const clientSecret = body.client_secret || `mcp_sec_${crypto.randomBytes(16).toString('hex')}`;
  const redirectUris = body.redirect_uris || ['https://chatgpt.com', 'https://chat.openai.com'];

  setResponseStatus(event, 201);
  return {
    client_id: clientId,
    client_secret: clientSecret,
    client_name: body.client_name || 'ChatGPT MCP Client',
    redirect_uris: redirectUris,
    grant_types: ['authorization_code', 'refresh_token'],
    response_types: ['code'],
    token_endpoint_auth_method: 'client_secret_post',
  };
});
