import { defineEventHandler } from 'h3';
import { getBaseUrl } from '../../utils/selfOAuth';

export default defineEventHandler((event) => {
  const baseUrl = getBaseUrl(event);
  return {
    issuer: baseUrl,
    authorization_endpoint: `${baseUrl}/oauth/authorize`,
    token_endpoint: `${baseUrl}/oauth/token`,
    registration_endpoint: `${baseUrl}/oauth/register`,
    response_types_supported: ['code'],
    grant_types_supported: ['authorization_code', 'refresh_token'],
    token_endpoint_auth_methods_supported: ['none', 'client_secret_post', 'client_secret_basic'],
    code_challenge_methods_supported: ['S256', 'plain'],
    scopes_supported: ['openid', 'email', 'all', 'products:read', 'products:write', 'design:write', 'homepage:write'],
  };
});
