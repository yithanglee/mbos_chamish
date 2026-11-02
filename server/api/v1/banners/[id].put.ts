import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { updateBanner } from '../../../utils/db';
import { requireAuth } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Banner ID required' });
  }

  const body = await readBody(event);
  const updated = await updateBanner(id, body);
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Banner not found' });
  }

  return {
    success: true,
    banner: updated,
  };
});
