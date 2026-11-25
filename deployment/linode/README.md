# MBOS on Linode (Nitro SSR + Admin Backend)

This deployment runs the modern Nitro application with standard PostgreSQL and local uploaded files. It includes the complete Admin Dashboard, CMS, product catalog management, and storefront without depending on Neon cloud services.

## Features

- Full Admin Portal (`/admin` and `/admin/login`) with TinyMCE rich text editor, product 6-slot gallery image manager, banners, and section editors.
- Decoupled from Neon: Uses local PostgreSQL connection pooling via standard `pg` pool, standalone admin password/key authentication, and local file storage.
- High performance Nitro Node.js runtime (`preset: node-server`).

## Data

`node scripts/export-blog.cjs` exports the public catalog and page APIs from
blog.damienslab.com plus referenced uploads into `data/blog-export`. This is an
application content export, not a complete source database backup. It does not
include unpublished content, accounts, or Neon-only changes. `manifest.json`
records counts, failed downloads, and image SHA-256 hashes. Keep `source.json`
unchanged as the recovery source.

## Deploy

Copy the repository (including ignored public assets, views, internal HTML, and
`data/blog-export`) to the VPS, excluding .env, .aws, .codex, .agents, node_modules,
.git, .neon, .wrangler, and .output. Do not copy the existing Neon .env.
Use an existing reverse proxy on the VPS; do not replace other hosted sites.

From `deployment/linode`:

1. Copy `.env.example` to `.env`. Set `POSTGRES_PASSWORD` and `ADMIN_PASSWORD` (or `ADMIN_API_KEY`).
   Restrict file access with `chmod 600 .env`. Add mail and Turnstile credentials if inquiries are needed.
2. Run `docker compose build web` and `docker compose up -d db`.
3. Run `docker compose run --rm --user 0 web node scripts/import-blog.cjs`.
   The import is transactional and initializes the database schema from `schema.sql`.
4. Run `docker compose up -d web`.
5. Test `curl -f http://127.0.0.1:5101/` and `http://127.0.0.1:5101/admin/login`.
6. Add a virtual host to the existing proxy for mbos.com.my and www.mbos.com.my,
   proxying to `http://127.0.0.1:5101`. Preserve Host and X-Forwarded-Proto.
7. Log into `/admin` with `ADMIN_PASSWORD` to manage products, banners, pages, and gallery images.

## Backups

Run `sh backup.sh` from this directory. It produces a custom-format pg_dump and
an uploads archive under `backups/`, with checksums. Schedule daily execution
using the VPS scheduler, copy backups off the VPS, and test restores periodically.
The database dump uses --no-owner/--no-acl for portability. Restore to an empty
PostgreSQL database with `pg_restore --no-owner --no-acl -d DATABASE backup.dump`.
Restore uploads into data/blog-export/uploads and restart the web service.

## Recovery/rollback

Keep the previous application and proxy configuration until the new site is
verified. This setup does not delete or modify the Neon project or original blog.
If deployment fails, restore the previous proxy routing. Database data lives in
a Docker volume: do not run `docker compose down -v`.

## Deployment status (25 November 2026)

Deployed at `/home/ubuntu/mbos-linode` on `139.162.60.209` using Compose project
`linode`: web binds to 127.0.0.1:5101 and PostgreSQL 18 is private to Docker.
Existing Nginx routing was reused without changes to other sites.
The public apex and www domains currently retain their Worker custom-domain
mappings. `proxy.mjs` forwards all requests to https://mbos.damienslab.com;
`proxy.wrangler.toml` deploys that small relay. This is independent of Neon.
A future direct DNS cutover requires Cloudflare DNS edit access and appropriate
origin TLS. Do not redeploy the old Nitro Worker over this relay.

Verified: 18 public routes, 45 exported uploaded files, local database import,
nonempty-table refusal, container build, and a production database/uploads backup.
Existing email and Turnstile settings were copied with explicit authorization.
No test email was sent. The original blog database and Neon project remain intact.

Mail verification returned Gmail EAUTH 535: the existing credentials are rejected.
A valid Gmail app password is required before inquiry emails can work. Missing
CAPTCHA requests were verified to return HTTP 400 without sending mail.
