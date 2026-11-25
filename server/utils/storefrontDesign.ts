import { getDb } from './db';

export async function manageStorefrontDesign(args: { action: string; id?: number; css?: string }) {
  const sql = getDb();
  switch (args.action) {
    case 'list': {
      const revisions = await sql`SELECT id, created_at FROM storefront_design_revisions ORDER BY id DESC LIMIT 100`;
      const [publication] = await sql`SELECT revision_id FROM storefront_design_publication WHERE singleton`;
      return { revisions, publishedId: publication?.revision_id ?? null };
    }
    case 'draft': {
      if (typeof args.css !== 'string' || !args.css.trim() || args.css.length > 100000) {
        throw new Error('Provide a stylesheet up to 100000 characters');
      }
      const [revision] = await sql`INSERT INTO storefront_design_revisions (css) VALUES (${args.css}) RETURNING id`;
      return { id: revision.id };
    }
    case 'preview':
    case 'publish': {
      if (!Number.isSafeInteger(args.id) || args.id! < 1 || args.id! > 2147483647) {
        throw new Error('Invalid revision ID');
      }
      const [revision] = await sql`SELECT id, css FROM storefront_design_revisions WHERE id = ${args.id}`;
      if (!revision) throw new Error('Revision not found');
      if (args.action === 'preview') return revision;
      await sql`
        INSERT INTO storefront_design_publication (revision_id) VALUES (${revision.id})
        ON CONFLICT (singleton) DO UPDATE SET revision_id = EXCLUDED.revision_id
      `;
      return { publishedId: revision.id };
    }
    case 'restore-default':
      await sql`UPDATE storefront_design_publication SET revision_id = NULL WHERE singleton`;
      return { publishedId: null };
    default:
      throw new Error('Unknown design action');
  }
}
