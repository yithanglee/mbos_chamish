import { createError, defineEventHandler } from 'h3';
import { mcpOAuthConfig } from '../../utils/mcpOAuth';

export default defineEventHandler(() => {
  const config = mcpOAuthConfig();
  if (!config) throw createError({ statusCode: 404 });
  return {
    resource: config.resource,
    authorization_servers: [config.issuer],
    scopes_supported: ['openid', 'email'],
  };
});
