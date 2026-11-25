import { createAuthClient } from '@neondatabase/auth';

export async function resumeOAuth(authUrl) {
  const status = document.querySelector('#status');
  const auth = createAuthClient(authUrl);

  try {
    const { data, error } = await auth.getSession();
    if (error || !data?.session) throw new Error('Session unavailable');

    const result = await auth.oauth2.continue({ selected: true });
    if (result.error) throw new Error('Authorization could not resume');
  } catch {
    status.textContent = 'Google sign-in finished, but the ChatGPT connection could not resume. Start a fresh connection from ChatGPT.';
  }
}
