import { createError, getQuery, setResponseHeader, type H3Event } from 'h3';

export function oauthPage(event: H3Event, mode: 'login' | 'consent') {
  const authUrl = process.env.NEON_AUTH_BASE_URL;
  if (!authUrl || new URL(authUrl).protocol !== 'https:') {
    throw createError({ statusCode: 503, statusMessage: 'Neon Auth is not configured' });
  }

  const title = mode === 'login' ? 'Sign in to MBOS Chamish' : 'Authorize access to MBOS Chamish';
  const nonce = crypto.randomUUID();
  const query = getQuery(event);
  const resume = mode === 'login' && typeof query.neon_auth_session_verifier === 'string' &&
    typeof query.sig === 'string' && Boolean(query.ba_param);
  const browserAuthUrl = JSON.stringify(authUrl.replace(/\/$/, '')).replace(/</g, '\\u003c');
  setResponseHeader(event, 'Content-Type', 'text/html; charset=utf-8');
  setResponseHeader(event, 'Cache-Control', 'no-store');
  setResponseHeader(event, 'Referrer-Policy', 'no-referrer');
  setResponseHeader(event, 'Content-Security-Policy',
    `default-src 'none'; script-src 'nonce-${nonce}' 'self'; connect-src ${new URL(authUrl).origin}; form-action 'none'; frame-ancestors 'none'; base-uri 'none'`);

  return `<!doctype html>
<html lang="en">
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${title}</title>
<main>
  <h1>${title}</h1>
  <p id="request"></p>
  <p id="status" role="status">${resume ? 'Finishing Google sign-in…' : ''}</p>
  <form hidden>
    ${mode === 'login' ? `
    <p><label>Work email <input name="email" type="email" autocomplete="username" required></label></p>
    <p><label>Password <input name="password" type="password" autocomplete="current-password" required></label></p>
    <button type="submit">Sign in</button>
    <button type="submit" value="google" formnovalidate>Continue with Google</button>
    ` : `
    <button type="submit" value="approve">Approve access</button>
    <button type="submit" value="deny">Deny access</button>
    `}
  </form>
</main>
${resume ? `<script type="module" nonce="${nonce}">
  import { resumeOAuth } from '/oauth-resume.js?v=2';
  resumeOAuth(${browserAuthUrl});
</script>` : `<script nonce="${nonce}">
  const authUrl = ${browserAuthUrl};
  const mode = ${JSON.stringify(mode)};
  const oauthQuery = location.search.slice(1);
  const params = new URLSearchParams(oauthQuery);
  const form = document.querySelector('form');
  const status = document.querySelector('#status');

  if (!params.has('client_id')) {
    status.textContent = 'Start a new connection from your MCP client to continue.';
  } else {
    form.hidden = false;
    const client = params.get('client_id');
    const scopes = params.get('scope') || 'No scopes listed';
    document.querySelector('#request').textContent =
      'Requesting client: ' + client + '. Requested permissions: ' + scopes + '.';
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const data = new FormData(form);
    const login = mode === 'login';
    const google = login && event.submitter?.value === 'google';
    const accept = event.submitter?.value === 'approve';
    const payload = { oauth_query: oauthQuery };
    let requestPath = '/oauth2/consent';
    if (google) {
      requestPath = '/sign-in/social';
      payload.provider = 'google';
      payload.disableRedirect = true;
    } else if (login) {
      requestPath = '/sign-in/email';
      payload.email = data.get('email');
      payload.password = data.get('password');
    } else {
      payload.accept = accept;
    }
    const buttons = [...form.querySelectorAll('button')];
    buttons.forEach((button) => { button.disabled = true; });
    status.textContent = 'Contacting Neon Auth…';

    try {
      const response = await fetch(authUrl + requestPath, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        redirect: 'error',
      });
      if (!response.ok) throw new Error();
      const result = await response.json();
      const destination = new URL(result.url);
      if (destination.protocol !== 'https:' || destination.username || destination.password) throw new Error();
      if (google && destination.origin !== 'https://accounts.google.com' &&
          destination.origin + destination.pathname !== authUrl + '/sign-in/social/init') {
        throw new Error();
      }
      location.assign(destination.href);
    } catch {
      status.textContent = google
        ? 'Google sign-in could not start. Start a new connection and try again.'
        : login
        ? 'Sign-in could not continue. Check your credentials or start a new connection.'
        : 'Neon Auth could not complete this request. Start a new connection and sign in again.';
      buttons.forEach((button) => { button.disabled = false; });
    }
  });
</script>`}
</html>`;
}
