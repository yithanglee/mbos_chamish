import { defineEventHandler, getRouterParam, createError } from 'h3';
import { deleteBanner } from '../../../../utils/db';
import { requireAuth } from '../../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Banner ID required' });
  }

  return await deleteBanner(id);
});
