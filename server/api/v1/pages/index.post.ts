import { defineEventHandler, readBody, createError } from 'h3';
import { createPage } from '../../../utils/db';
import { requireAuth } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);
  const body = await readBody(event);

  if (!body || !body.name || !body.route_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Page name and route_name are required',
    });
  }

  const newPage = await createPage({
    name: body.name,
    subtitle: body.subtitle,
    route_name: body.route_name,
    content: body.content || '',
    img_url: body.img_url,
    sorting_index: body.sorting_index !== undefined ? parseInt(body.sorting_index, 10) : 10,
    show_nav: body.show_nav !== undefined ? Boolean(body.show_nav) : false,
  });

  return {
    success: true,
    page: newPage,
  };
});
