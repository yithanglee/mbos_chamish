import type { H3Event } from 'h3';
import fs from 'node:fs';
import path from 'node:path';

export const bucketName = process.env.R2_BUCKET_NAME || 'mbos-asset';

const DEFAULT_R2_ENDPOINT = 'https://7b3e2d417e9869cceb889fee76d4cf15.r2.cloudflarestorage.com';

/**
 * Returns the public URL for an asset key.
 * If R2_PUBLIC_URL is configured (e.g., https://assets.mbos.com.my or https://pub-xxx.r2.dev), uses that.
 * Otherwise, falls back to the native /images/uploads/ route served by Cloudflare Pages.
 */
export function getPublicStorageUrl(key: string): string {
  const cleanKey = key.replace(/^\/+/, '');
  const r2PublicUrl = process.env.R2_PUBLIC_URL ? process.env.R2_PUBLIC_URL.replace(/\/$/, '') : '';
  
  if (r2PublicUrl) {
    return `${r2PublicUrl}/${cleanKey}`;
  }

  // If pointing to images/uploads/, serve directly through our edge route
  if (cleanKey.startsWith('images/uploads/')) {
    return `/${cleanKey}`;
  }

  // Default fallback to S3/R2 endpoint if provided
  const s3Endpoint = (process.env.R2_ENDPOINT || process.env.AWS_ENDPOINT_URL_S3 || DEFAULT_R2_ENDPOINT).replace(/\/$/, '');
  if (s3Endpoint) {
    return `${s3Endpoint}/${bucketName}/${cleanKey}`;
  }

  return `/${cleanKey}`;
}

export function getS3Endpoint(): string {
  return (process.env.R2_ENDPOINT || process.env.AWS_ENDPOINT_URL_S3 || DEFAULT_R2_ENDPOINT).replace(/\/$/, '');
}

/**
 * Upload an image to Cloudflare R2 Object Storage.
 * Prioritizes native Cloudflare Worker R2 binding (event.context.cloudflare.env.R2_BUCKET).
 * Falls back to S3-compatible API or local disk if running offline.
 */
export async function uploadImage(
  filename: string,
  buffer: Uint8Array | Buffer,
  contentType = 'image/jpeg',
  event?: H3Event
) {
  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const targetKey = `images/uploads/${timestamp}_${cleanFilename}`;

  // 1. Cloudflare Native R2 Binding (Pages / Workers environment)
  const cloudflareEnv = (event?.context?.cloudflare as any)?.env;
  const r2Bucket = cloudflareEnv?.R2_BUCKET;

  if (r2Bucket && typeof r2Bucket.put === 'function') {
    await r2Bucket.put(targetKey, buffer, {
      httpMetadata: {
        contentType,
        cacheControl: 'public, max-age=31536000, immutable',
      },
    });

    return {
      key: targetKey,
      filename: `${timestamp}_${cleanFilename}`,
      url: getPublicStorageUrl(targetKey),
      storage: 'cloudflare-r2-native',
    };
  }

  // 2. Cloudflare R2 via S3-compatible API (if credentials configured)
  const accessKey = process.env.R2_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.R2_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = process.env.R2_ENDPOINT || process.env.AWS_ENDPOINT_URL_S3;

  if (accessKey && secretKey && endpoint) {
    const { S3Client, PutObjectCommand } = await import('@aws-sdk/client-s3');
    const s3 = new S3Client({
      region: 'auto',
      endpoint,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey,
      },
      forcePathStyle: true,
    });

    await s3.send(new PutObjectCommand({
      Bucket: bucketName,
      Key: targetKey,
      Body: buffer,
      ContentType: contentType,
    }));

    return {
      key: targetKey,
      filename: `${timestamp}_${cleanFilename}`,
      url: getPublicStorageUrl(targetKey),
      storage: 'cloudflare-r2-s3',
    };
  }

  // 3. Local filesystem fallback for dev server (when running without R2 credentials)
  try {
    const uploadDir = path.join(process.cwd(), 'public/images/uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    fs.writeFileSync(path.join(uploadDir, `${timestamp}_${cleanFilename}`), Buffer.from(buffer));
    return {
      key: targetKey,
      filename: `${timestamp}_${cleanFilename}`,
      url: `/${targetKey}`,
      storage: 'local-filesystem',
    };
  } catch (err) {
    console.error('Error in local file upload fallback:', err);
  }

  return {
    key: targetKey,
    filename: `${timestamp}_${cleanFilename}`,
    url: getPublicStorageUrl(targetKey),
    storage: 'fallback',
  };
}

// Backward-compatible alias
export const uploadImageToNeon = uploadImage;
