import { defineEventHandler, getRouterParam, setResponseHeader, sendRedirect } from 'h3';
import { getPublicStorageUrl } from '../../../utils/storage';
import fs from 'node:fs';
import path from 'node:path';

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename');
  if (!filename) return;

  // 1. Check local filesystem if running on VPS / Node
  const uploadsDir = process.env.UPLOADS_DIR || path.join(process.cwd(), 'data/uploads');
  const localFile = path.join(uploadsDir, filename);
  const publicLocalFile = path.join(process.cwd(), 'public/images/uploads', filename);

  const filePath = fs.existsSync(localFile) ? localFile : (fs.existsSync(publicLocalFile) ? publicLocalFile : null);
  if (filePath) {
    const ext = path.extname(filename).toLowerCase();
    const mimeMap: Record<string, string> = {
      '.jpg': 'image/jpeg',
      '.jpeg': 'image/jpeg',
      '.png': 'image/png',
      '.webp': 'image/webp',
      '.gif': 'image/gif',
      '.svg': 'image/svg+xml',
    };
    const contentType = mimeMap[ext] || 'application/octet-stream';
    setResponseHeader(event, 'content-type', contentType);
    setResponseHeader(event, 'cache-control', 'public, max-age=31536000, immutable');
    return fs.readFileSync(filePath);
  }

  const targetKey = `images/uploads/${filename}`;

  // 2. Check native Cloudflare R2 binding
  const cloudflareEnv = (event.context?.cloudflare as any)?.env;
  const r2Bucket = cloudflareEnv?.R2_BUCKET;

  if (r2Bucket && typeof r2Bucket.get === 'function') {
    const object = await r2Bucket.get(targetKey);
    if (object) {
      const contentType = object.httpMetadata?.contentType || 'image/jpeg';
      setResponseHeader(event, 'content-type', contentType);
      setResponseHeader(event, 'cache-control', 'public, max-age=31536000, immutable');
      setResponseHeader(event, 'etag', object.httpEtag);
      return object.body;
    }
  }

  // 3. Redirect fallback to public URL
  const target = getPublicStorageUrl(targetKey);
  if (target && !target.startsWith('/images/uploads/')) {
    return sendRedirect(event, target, 301);
  }
});
