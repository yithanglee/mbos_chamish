import { createError, type H3Event } from 'h3';
import fs from 'node:fs';
import path from 'node:path';

export const bucketName = process.env.AWS_BUCKET_NAME || process.env.NEON_BUCKET_NAME || 'assets';

const DEFAULT_NEON_STORAGE_ENDPOINT = 'https://br-floral-tree-b35p9voh.storage.c-4.ap-southeast-1.aws.neon.tech';

export function getS3Endpoint(): string {
  return (process.env.AWS_ENDPOINT_URL_S3 || process.env.NEON_STORAGE_ENDPOINT || DEFAULT_NEON_STORAGE_ENDPOINT).replace(/\/$/, '');
}

/**
 * Returns the public URL for an asset key in Neon Object Storage.
 * Example: https://br-floral-tree-b35p9voh.storage.c-4.ap-southeast-1.aws.neon.tech/assets/images/uploads/Diagonal%20All%20Black.png
 */
export function getPublicStorageUrl(key: string = ''): string {
  const cleanKey = key.replace(/^\/+/, '');
  const baseBlogUrl = process.env.BLOG_URL ? process.env.BLOG_URL.replace(/\/$/, '') : '';
  const baseUrl = baseBlogUrl && !baseBlogUrl.includes('localhost')
    ? baseBlogUrl
    : `${getS3Endpoint()}/${bucketName}`;

  if (!cleanKey) {
    return baseUrl;
  }

  return `${baseUrl}/${cleanKey}`;
}

async function sha256Hex(data: Uint8Array | string): Promise<string> {
  const enc = new TextEncoder();
  const buffer = typeof data === 'string' ? enc.encode(data) : data;
  const digest = await crypto.subtle.digest('SHA-256', buffer as any);
  return Array.from(new Uint8Array(digest)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function hmac(keyData: Uint8Array | string, msgData: Uint8Array | string): Promise<Uint8Array> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    typeof keyData === 'string' ? enc.encode(keyData) : keyData,
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  const signature = await crypto.subtle.sign(
    'HMAC',
    key,
    typeof msgData === 'string' ? enc.encode(msgData) : msgData
  );
  return new Uint8Array(signature);
}

/**
 * Upload an image directly to Neon Object Storage (assets bucket) using native AWS Signature V4.
 * Fully compatible with Cloudflare Workers (V8 isolate) and Node.js with zero external dependencies.
 */
export async function uploadImage(
  filename: string,
  buffer: Uint8Array | Buffer,
  contentType = 'image/jpeg',
  event?: H3Event,
  requireNeon = false
) {
  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const targetKey = `images/uploads/${timestamp}_${cleanFilename}`;

  const accessKey = process.env.AWS_ACCESS_KEY_ID;
  const secretKey = process.env.AWS_SECRET_ACCESS_KEY;
  const endpoint = getS3Endpoint();
  const region = process.env.AWS_REGION || 'ap-southeast-1';

  if (accessKey && secretKey && endpoint) {
    const url = new URL(`${endpoint}/${bucketName}/${targetKey}`);
    const now = new Date();
    const amzDate = now.toISOString().replace(/[:-]|\.\d{3}/g, '');
    const dateStamp = amzDate.slice(0, 8);

    const payloadHash = await sha256Hex(buffer);

    const canonicalHeaders = `host:${url.host}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`;
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date';

    const canonicalUri = '/' + [bucketName, ...targetKey.split('/')].map(encodeURIComponent).join('/');
    const canonicalRequest = `PUT\n${canonicalUri}\n\n${canonicalHeaders}\n${signedHeaders}\n${payloadHash}`;

    const credentialScope = `${dateStamp}/${region}/s3/aws4_request`;
    const stringToSign = `AWS4-HMAC-SHA256\n${amzDate}\n${credentialScope}\n${await sha256Hex(canonicalRequest)}`;

    const kDate = await hmac('AWS4' + secretKey, dateStamp);
    const kRegion = await hmac(kDate, region);
    const kService = await hmac(kRegion, 's3');
    const kSigning = await hmac(kService, 'aws4_request');
    const signatureBytes = await hmac(kSigning, stringToSign);
    const signature = Array.from(signatureBytes).map(b => b.toString(16).padStart(2, '0')).join('');

    const authHeader = `AWS4-HMAC-SHA256 Credential=${accessKey}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`;

    const res = await fetch(url.toString(), {
      method: 'PUT',
      headers: {
        'host': url.host,
        'x-amz-date': amzDate,
        'x-amz-content-sha256': payloadHash,
        'Authorization': authHeader,
        'Content-Type': contentType,
      },
      body: buffer as any,
    });

    if (!res.ok) {
      const errText = await res.text();
      console.error(`Neon S3 Upload Failed (${res.status} ${res.statusText}):`, errText);
      throw new Error(`Upload to Neon storage failed: ${res.statusText} (${res.status})`);
    }

    return {
      key: targetKey,
      filename: `${timestamp}_${cleanFilename}`,
      url: getPublicStorageUrl(targetKey),
      storage: 'neon-s3',
    };
  }

  if (requireNeon) {
    throw createError({ statusCode: 503, statusMessage: 'Neon Object Storage credentials are missing' });
  }

  // Local filesystem fallback for dev server without credentials
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

export const uploadImageToNeon = uploadImage;
