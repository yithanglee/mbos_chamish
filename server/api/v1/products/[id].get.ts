import { defineEventHandler, getRouterParam, createError } from 'h3';
import { getProductById } from '../../../../utils/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  if (!id) {
    throw createError({ statusCode: 400, statusMessage: 'ID parameter required' });
  }

  const product = await getProductById(id);
  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' });
  }

  return product;
});
