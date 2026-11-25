import { defineEventHandler } from 'h3';
import { getBaseUrl } from '../../utils/selfOAuth';

export default defineEventHandler((event) => {
  const baseUrl = getBaseUrl(event);
  const resource = process.env.MCP_OAUTH_RESOURCE || `${baseUrl}/api/mcp`;
  return {
    resource,
    authorization_servers: [baseUrl],
    scopes_supported: ['openid', 'email', 'all', 'products:read', 'products:write', 'design:write', 'homepage:write'],
  };
});
