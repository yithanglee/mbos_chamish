import { defineEventHandler, getQuery } from 'h3';
import { getProducts } from '../../../utils/db';

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const category_id = query.category_id ? parseInt(query.category_id as string, 10) : undefined;
  const brand_id = query.brand_id ? parseInt(query.brand_id as string, 10) : undefined;
  const search = query.search ? String(query.search) : undefined;

  const data = await getProducts({ category_id, brand_id, search });
  return data;
});
