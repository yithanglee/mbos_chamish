import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { updatePage } from '../../../utils/db';
import { requireAuth } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID parameter required' });
  }

  const body = await readBody(event);
  const updated = await updatePage(id, body);
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Page not found' });
  }

  return {
    success: true,
    page: updated,
  };
});
