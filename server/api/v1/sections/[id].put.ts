import { defineEventHandler, getRouterParam, readBody, createError } from 'h3';
import { updateSection } from '../../../../utils/db';
import { requireAuth } from '../../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'Section ID required' });
  }

  const body = await readBody(event);
  const updated = await updateSection(id, body);
  if (!updated) {
    throw createError({ statusCode: 404, statusMessage: 'Section not found' });
  }

  return {
    success: true,
    section: updated,
  };
});
