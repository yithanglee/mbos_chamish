import { defineEventHandler, getRouterParam, createError } from 'h3';
import { deletePage } from '../../../utils/db';
import { requireAuth } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID parameter required' });
  }

  const result = await deletePage(id);
  return result;
});
