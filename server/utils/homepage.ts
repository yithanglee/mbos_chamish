import { createError } from 'h3';
import { getDb } from './db';

export async function getPublishedHomepage() {
  const sql = getDb();
  const [page] = await sql`
    SELECT r.html FROM homepage_publication p
    JOIN homepage_revisions r ON r.id = p.revision_id
    WHERE p.singleton
  `;
  return page?.html as string | undefined;
}

export function requireHomepageCms() {
  if (process.env.HOMEPAGE_CMS_ENABLED !== 'true' || !(process.env.ADMIN_API_KEY || process.env.ADMIN_PASSWORD)) {
    throw createError({ statusCode: 404, statusMessage: 'Homepage CMS is disabled' });
  }
}

export async function listHomepageRevisions() {
  requireHomepageCms();
  const sql = getDb();
  const revisions = await sql`
    SELECT id, created_at FROM homepage_revisions ORDER BY id DESC
  `;
  const [publication] = await sql`SELECT revision_id FROM homepage_publication WHERE singleton`;
  return { revisions, publishedId: publication?.revision_id ?? null };
}

export async function manageHomepageRevision(body: { action?: string; html?: unknown; id?: number } | null) {
  requireHomepageCms();
  const sql = getDb();
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
    if (typeof body.id !== 'number' || !Number.isSafeInteger(body.id) || body.id < 1 || body.id > 2147483647) {
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
}
