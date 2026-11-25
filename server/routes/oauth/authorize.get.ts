import { defineEventHandler, getQuery, getCookie, setCookie, sendRedirect, setResponseHeader } from 'h3';
import { createAuthorizationCode } from '../../utils/selfOAuth';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const clientId = (query.client_id as string) || 'chatgpt';
  const redirectUri = (query.redirect_uri as string) || '';
  const state = (query.state as string) || '';
  const codeChallenge = (query.code_challenge as string) || undefined;
  const codeChallengeMethod = (query.code_challenge_method as string) || undefined;
  const scope = (query.scope as string) || 'all products:read products:write design:write homepage:write';

  // Check if admin is already logged in
  const authCookie = getCookie(event, 'admin_auth');
  const expectedPassword = process.env.ADMIN_PASSWORD || process.env.ADMIN_API_KEY || 'mbos_ai_agent_secret_key';

  if (authCookie && authCookie === expectedPassword && redirectUri) {
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
  }

  // Render authorization page
  setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8');
  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>Authorize MCP - MBOS Chamish</title>
  <style>
    body { font-family: system-ui, -apple-system, sans-serif; background: #0f172a; color: #f8fafc; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; }
    .card { background: #1e293b; border-radius: 12px; padding: 32px; width: 100%; max-width: 440px; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); }
    h1 { font-size: 20px; margin: 0 0 12px; color: #f8fafc; font-weight: 600; text-align: center; }
    p { font-size: 14px; color: #94a3b8; line-height: 1.5; margin: 0 0 24px; text-align: center; }
    .scopes { background: #0f172a; border-radius: 8px; padding: 12px; margin-bottom: 24px; font-size: 13px; color: #38bdf8; }
    .scopes div { margin-bottom: 4px; }
    label { display: block; font-size: 13px; color: #cbd5e1; margin-bottom: 6px; font-weight: 500; }
    input[type="password"] { width: 100%; box-sizing: border-box; padding: 10px 12px; background: #0f172a; border: 1px solid #334155; border-radius: 6px; color: white; font-size: 14px; margin-bottom: 20px; }
    input[type="password"]:focus { outline: none; border-color: #38bdf8; }
    button { width: 100%; padding: 12px; background: #0284c7; hover: #0369a1; border: none; border-radius: 6px; color: white; font-weight: 600; cursor: pointer; font-size: 14px; transition: background 0.15s; }
    button:hover { background: #0369a1; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Authorize ChatGPT Access</h1>
    <p>Grant ChatGPT access to MBOS Storefront, Products, and Homepage CMS Design tools.</p>
    
    <div class="scopes">
      <div>✓ Safety Eyewear Catalog & Products</div>
      <div>✓ Homepage HTML & Storefront Design Revisions</div>
      <div>✓ Landing Page Sections & Banners</div>
    </div>

    <form method="POST" action="/oauth/authorize">
      <input type="hidden" name="client_id" value="${clientId}">
      <input type="hidden" name="redirect_uri" value="${redirectUri}">
      <input type="hidden" name="state" value="${state}">
      <input type="hidden" name="code_challenge" value="${codeChallenge || ''}">
      <input type="hidden" name="code_challenge_method" value="${codeChallengeMethod || ''}">
      <input type="hidden" name="scope" value="${scope}">

      <label for="password">Enter Admin Password to Authorize</label>
      <input type="password" id="password" name="password" placeholder="Admin Password" required autofocus>

      <button type="submit">Authorize Connection</button>
    </form>
  </div>
</body>
</html>`;
});
