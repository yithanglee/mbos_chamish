#!/bin/sh
set -eu
umask 077
cd "$(dirname "$0")"
stamp=$(date -u +%Y%m%dT%H%M%SZ)
backup_dir="../../backups/$stamp"
mkdir -p "$backup_dir"
docker compose exec -T db pg_dump -U mbos -d mbos -Fc --no-owner --no-acl > "$backup_dir/mbos.dump.partial"
mv "$backup_dir/mbos.dump.partial" "$backup_dir/mbos.dump"
tar -czf "$backup_dir/uploads.tar.gz" -C ../../data/blog-export uploads
(cd "$backup_dir" && sha256sum mbos.dump uploads.tar.gz > SHA256SUMS)
printf 'Backup saved: %s\n' "$backup_dir"
