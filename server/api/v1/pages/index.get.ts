import { defineEventHandler } from 'h3';
import { getPages } from '../../../utils/db';

export default defineEventHandler(async () => {
  const pages = await getPages();
  return pages;
});
