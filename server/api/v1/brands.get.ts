import { defineEventHandler } from 'h3';
import { getBrands } from '../../../utils/db';

export default defineEventHandler(async () => {
  return await getBrands();
});
