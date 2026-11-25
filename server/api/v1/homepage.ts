import { createError, defineEventHandler, getHeader, getMethod, readBody, setResponseHeader } from 'h3';
import { requireAuth } from '../../utils/auth';
import { listHomepageRevisions, manageHomepageRevision, requireHomepageCms } from '../../utils/homepage';

export default defineEventHandler(async (event) => {
  requireHomepageCms();
  await requireAuth(event);
  setResponseHeader(event, 'Cache-Control', 'no-store');
  if (getMethod(event) === 'GET') return listHomepageRevisions();
  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
  }
  if (getHeader(event, 'content-type')?.split(';')[0] !== 'application/json') {
    throw createError({ statusCode: 415, statusMessage: 'JSON required' });
  }
  return manageHomepageRevision(await readBody(event));
});
