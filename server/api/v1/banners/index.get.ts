import { defineEventHandler } from 'h3';
import { getAllBanners } from '../../../../utils/db';

export default defineEventHandler(async () => {
  return await getAllBanners();
});
