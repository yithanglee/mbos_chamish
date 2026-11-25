import { createError } from 'h3';
import { getDb } from './db';

let tablesChecked = false;

async function ensurePageRevisionTables(sql: any) {
  if (tablesChecked) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS page_revisions (
        id integer GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
        page_id bigint REFERENCES pages(id) ON DELETE CASCADE,
        route_name varchar(255) NOT NULL,
        html text NOT NULL,
        created_at timestamptz NOT NULL DEFAULT now()
      )
    `;
    await sql`
      CREATE TABLE IF NOT EXISTS page_publication (
        page_id bigint PRIMARY KEY REFERENCES pages(id) ON DELETE CASCADE,
        revision_id integer REFERENCES page_revisions(id)
      )
    `;
    tablesChecked = true;
  } catch (err) {
    console.warn('Could not auto-create page_revisions tables:', err);
  }
}

function normalizeRoute(route?: string | null): string {
  if (!route || typeof route !== 'string') return '/';
  const trimmed = route.trim();
  if (trimmed === '/' || trimmed === 'home' || trimmed === '/home' || trimmed === 'landing' || trimmed === '/landing') {
    return '/';
  }
  return '/' + trimmed.replace(/^\/+/, '');
}

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

export async function listHomepageRevisions(pageRoute?: string) {
  requireHomepageCms();
  const sql = getDb();
  const route = normalizeRoute(pageRoute);

  // Sub-page revisions
  if (route !== '/') {
    await ensurePageRevisionTables(sql);
    const cleanRoute = route.replace(/^\/+/, '');
    const revisions = await sql`
      SELECT id, page_id, route_name, created_at 
      FROM page_revisions 
      WHERE route_name = ${route} OR route_name = ${cleanRoute} 
      ORDER BY id DESC
    `;

    const [page] = await sql`SELECT id FROM pages WHERE route_name = ${route} OR route_name = ${cleanRoute} LIMIT 1`;
    let publishedId: number | null = null;
    if (page?.id) {
      const [pub] = await sql`SELECT revision_id FROM page_publication WHERE page_id = ${page.id}`;
      publishedId = pub?.revision_id ?? null;
    }
    return { revisions, publishedId, page: route };
  }

  // Root homepage revisions
  const revisions = await sql`
    SELECT id, created_at FROM homepage_revisions ORDER BY id DESC
  `;
  const [publication] = await sql`SELECT revision_id FROM homepage_publication WHERE singleton`;
  return { revisions, publishedId: publication?.revision_id ?? null, page: '/' };
}

export async function manageHomepageRevision(body: { action?: string; html?: unknown; id?: number; page?: string; route?: string } | null) {
  requireHomepageCms();
  const sql = getDb();
  const route = normalizeRoute(body?.page || body?.route);

  // 1. Sub-page revisions (e.g. /products_rx)
  if (route !== '/') {
    await ensurePageRevisionTables(sql);
    const cleanRoute = route.replace(/^\/+/, '');

    if (body?.action === 'draft') {
      if (typeof body.html !== 'string' || !body.html.trim() || body.html.length > 2000000) {
        throw createError({ statusCode: 400, statusMessage: 'Provide an HTML document up to 2000000 characters' });
      }
      const { html } = body;
      const [page] = await sql`SELECT id FROM pages WHERE route_name = ${route} OR route_name = ${cleanRoute} LIMIT 1`;
      const [revision] = await sql`
        INSERT INTO page_revisions (page_id, route_name, html) 
        VALUES (${page?.id || null}, ${route}, ${html}) 
        RETURNING id
      `;
      return { id: revision.id, html, page: route };
    }

    if (body?.action === 'preview' || body?.action === 'publish') {
      if (typeof body.id !== 'number' || !Number.isSafeInteger(body.id) || body.id < 1 || body.id > 2147483647) {
        throw createError({ statusCode: 400, statusMessage: 'Invalid revision ID' });
      }
      const [revision] = await sql`SELECT id, page_id, route_name, html FROM page_revisions WHERE id = ${body.id}`;
      if (!revision) throw createError({ statusCode: 404, statusMessage: 'Revision not found' });
      if (body.action === 'preview') return { ...revision, page: route };

      // Publish revision: update pages content and page_publication pointer
      let pageId = revision.page_id;
      if (!pageId) {
        const [existing] = await sql`SELECT id FROM pages WHERE route_name = ${route} OR route_name = ${cleanRoute} LIMIT 1`;
        pageId = existing?.id;
      }

      if (pageId) {
        await sql`
          INSERT INTO page_publication (page_id, revision_id) VALUES (${pageId}, ${revision.id})
          ON CONFLICT (page_id) DO UPDATE SET revision_id = EXCLUDED.revision_id
        `;
        await sql`
          UPDATE pages 
          SET content = ${revision.html}, updated_at = NOW() 
          WHERE id = ${pageId}
        `;
      }

      return { publishedId: revision.id, page: route };
    }

    if (body?.action === 'restore-default') {
      const [page] = await sql`SELECT id FROM pages WHERE route_name = ${route} OR route_name = ${cleanRoute} LIMIT 1`;
      if (page?.id) {
        await sql`DELETE FROM page_publication WHERE page_id = ${page.id}`;
        await sql`UPDATE pages SET content = NULL, updated_at = NOW() WHERE id = ${page.id}`;
      }
      return { publishedId: null, page: route };
    }

    throw createError({ statusCode: 400, statusMessage: 'Unknown page revision action' });
  }

  // 2. Root homepage revisions (/)
  if (body?.action === 'draft') {
    if (typeof body.html !== 'string' || !body.html.trim() || body.html.length > 2000000) {
      throw createError({ statusCode: 400, statusMessage: 'Provide an HTML document up to 2000000 characters' });
    }
    const { html } = body;
    const [revision] = await sql`
      INSERT INTO homepage_revisions (html) VALUES (${html}) RETURNING id
    `;
    return { id: revision.id, html, page: '/' };
  }
  if (body?.action === 'preview' || body?.action === 'publish') {
    if (typeof body.id !== 'number' || !Number.isSafeInteger(body.id) || body.id < 1 || body.id > 2147483647) {
      throw createError({ statusCode: 400, statusMessage: 'Invalid revision ID' });
    }
    const [revision] = await sql`SELECT id, html FROM homepage_revisions WHERE id = ${body.id}`;
    if (!revision) throw createError({ statusCode: 404, statusMessage: 'Revision not found' });
    if (body.action === 'preview') return { ...revision, page: '/' };

    await sql`
      INSERT INTO homepage_publication (revision_id) VALUES (${revision.id})
      ON CONFLICT (singleton) DO UPDATE SET revision_id = EXCLUDED.revision_id
    `;
    return { publishedId: revision.id, page: '/' };
  }
  if (body?.action === 'restore-default') {
    await sql`UPDATE homepage_publication SET revision_id = NULL WHERE singleton`;
    return { publishedId: null, page: '/' };
  }
  throw createError({ statusCode: 400, statusMessage: 'Unknown homepage action' });
}
