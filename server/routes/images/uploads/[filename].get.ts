import { defineEventHandler, getRouterParam, sendRedirect } from 'h3';
import { getPublicStorageUrl } from '../../../utils/storage';

export default defineEventHandler((event) => {
  const filename = getRouterParam(event, 'filename');
  const target = getPublicStorageUrl(`images/uploads/${filename}`);
  return sendRedirect(event, target, 301);
});
