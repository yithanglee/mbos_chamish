import { defineEventHandler } from 'h3';
import { requireAuth } from '../../utils/auth';

export default defineEventHandler(async (event) => {
  const auth = await requireAuth(event);
  return {
    authenticated: true,
    user: auth,
  };
});
