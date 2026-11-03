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
