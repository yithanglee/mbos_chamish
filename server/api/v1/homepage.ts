import { createError, defineEventHandler, getHeader, getMethod, readBody, setResponseHeader } from 'h3';
import { requireAuth } from '../../utils/auth';
import { getDb } from '../../utils/db';

export default defineEventHandler(async (event) => {
  if (process.env.HOMEPAGE_CMS_ENABLED !== 'true' || !process.env.ADMIN_API_KEY) {
    throw createError({ statusCode: 404, statusMessage: 'Homepage CMS is disabled' });
  }
  await requireAuth(event);
  setResponseHeader(event, 'Cache-Control', 'no-store');
  const sql = getDb();
  if (getMethod(event) === 'GET') {
    const revisions = await sql`
      SELECT id, created_at FROM homepage_revisions ORDER BY id DESC
    `;
    const [publication] = await sql`SELECT revision_id FROM homepage_publication WHERE singleton`;
    return { revisions, publishedId: publication?.revision_id ?? null };
  }
  if (getMethod(event) !== 'POST') {
    throw createError({ statusCode: 405, statusMessage: 'Method not allowed' });
  }
  if (getHeader(event, 'content-type')?.split(';')[0] !== 'application/json') {
    throw createError({ statusCode: 415, statusMessage: 'JSON required' });
  }
  const body = await readBody(event);
  if (body?.action === 'draft') {
    if (typeof body.html !== 'string' || !body.html.trim() || body.html.length > 2000000) {
      throw createError({ statusCode: 400, statusMessage: 'Provide an HTML document up to 2000000 characters' });
    }
    const { html } = body;
    const [revision] = await sql`
      INSERT INTO homepage_revisions (html) VALUES (${html}) RETURNING id
    `;
    return { id: revision.id, html };
  }
  if (body?.action === 'preview' || body?.action === 'publish') {
    if (!Number.isSafeInteger(body.id) || body.id < 1 || body.id > 2147483647) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid revision ID' });
    }
    const [revision] = await sql`SELECT id, html FROM homepage_revisions WHERE id = ${body.id}`;
    if (!revision) throw createError({ statusCode: 404, statusMessage: 'Revision not found' });
    if (body.action === 'preview') return revision;

    await sql`
      INSERT INTO homepage_publication (revision_id) VALUES (${revision.id})
      ON CONFLICT (singleton) DO UPDATE SET revision_id = EXCLUDED.revision_id
    `;
    return { publishedId: revision.id };
  }
  if (body?.action === 'restore-default') {
    await sql`UPDATE homepage_publication SET revision_id = NULL WHERE singleton`;
    return { publishedId: null };
  }
  throw createError({ statusCode: 400, statusMessage: 'Unknown homepage action' });
});
