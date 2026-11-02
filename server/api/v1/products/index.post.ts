import { defineEventHandler, readBody, createError } from 'h3';
import { createProduct } from '../../../utils/db';
import { requireAuth } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const body = await readBody(event);

  if (!body || !body.name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Product name is required',
    });
  }

  const newProduct = await createProduct({
    name: body.name,
    short_desc: body.short_desc,
    desc: body.desc,
    category_id: body.category_id ? parseInt(body.category_id, 10) : null,
    brand_id: body.brand_id ? parseInt(body.brand_id, 10) : null,
    img_url: body.img_url,
    img_url2: body.img_url2,
    img_url3: body.img_url3,
    img_url4: body.img_url4,
    img_url5: body.img_url5,
    img_url6: body.img_url6,
    balance: body.balance !== undefined ? parseInt(body.balance, 10) : 0,
  });

  return {
    success: true,
    product: newProduct,
  };
});
