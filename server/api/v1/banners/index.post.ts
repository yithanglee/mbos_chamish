import { defineEventHandler, readBody, createError } from 'h3';
import { createBanner } from '../../../../utils/db';
import { requireAuth } from '../../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const body = await readBody(event);

  if (!body || !body.img_url) {
    throw createError({ statusCode: 400, statusMessage: 'Image URL is required for banner' });
  }

  const banner = await createBanner({
    order: body.order ? parseInt(body.order, 10) : 0,
    img_url: body.img_url,
    mobile_img_url: body.mobile_img_url,
    remarks: body.remarks,
    is_show: body.is_show !== undefined ? Boolean(body.is_show) : true,
    content: body.content,
    is_banner: body.is_banner !== undefined ? Boolean(body.is_banner) : true,
  });

  return {
    success: true,
    banner,
  };
});
