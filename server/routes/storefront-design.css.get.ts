import { defineEventHandler, setResponseHeader } from 'h3';
import { getDb } from '../utils/db';

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'Content-Type', 'text/css; charset=utf-8');
  setResponseHeader(event, 'X-Content-Type-Options', 'nosniff');
  setResponseHeader(event, 'Cache-Control', 'no-cache');
  const sql = getDb();
  const [revision] = await sql`
    SELECT r.css FROM storefront_design_publication p
    JOIN storefront_design_revisions r ON r.id = p.revision_id
    WHERE p.singleton
  `;
  return revision?.css ?? '/* No published storefront design overrides. */';
});
