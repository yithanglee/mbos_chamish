import { defineEventHandler, getRouterParam, setResponseHeader, sendRedirect } from 'h3';
import { getPublicStorageUrl } from '../../../utils/storage';

export default defineEventHandler(async (event) => {
  const filename = getRouterParam(event, 'filename');
  if (!filename) return;

  const targetKey = `images/uploads/${filename}`;

  // 1. Check native Cloudflare R2 binding
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

  // 2. Redirect fallback to public URL
  const target = getPublicStorageUrl(targetKey);
  if (target && !target.startsWith('/images/uploads/')) {
    return sendRedirect(event, target, 301);
  }
});
