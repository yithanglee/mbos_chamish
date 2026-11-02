import { defineEventHandler, getRouterParam, createError } from 'h3';
import { deleteProduct, getProductById } from '../../../../utils/db';
import { requireAuth } from '../../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID parameter required' });
  }

  const existing = await getProductById(id);
  if (!existing) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  }

  const res = await deleteProduct(id);
  return res;
});
