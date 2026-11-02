import { defineEventHandler, deleteCookie } from 'h3';

export default defineEventHandler((event) => {
  deleteCookie(event, 'admin_auth', { path: '/' });
  deleteCookie(event, 'neon_session', { path: '/' });
  deleteCookie(event, 'better-auth.session_token', { path: '/' });
  return { success: true };
});
