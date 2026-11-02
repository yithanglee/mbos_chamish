import { defineEventHandler } from 'h3';
import { getCategories } from '../../utils/db';

export default defineEventHandler(async () => {
  return await getCategories();
});
