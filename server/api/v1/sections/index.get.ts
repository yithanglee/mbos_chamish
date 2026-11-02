import { defineEventHandler } from 'h3';
import { getSections } from '../../../../utils/db';

export default defineEventHandler(async () => {
  return await getSections();
});
