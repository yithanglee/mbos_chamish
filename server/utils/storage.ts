import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

const bucketName = 'assets';

function getS3Endpoint() {
  return (process.env.AWS_ENDPOINT_URL_S3 || '').replace(/\/$/, '');
}

function getS3Client() {
  return new S3Client({
    region: process.env.AWS_REGION || 'ap-southeast-1',
    endpoint: process.env.AWS_ENDPOINT_URL_S3,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
    },
    forcePathStyle: true,
  });
}

export function getPublicStorageUrl(key: string): string {
  const cleanKey = key.replace(/^\/+/, '');
  return `${getS3Endpoint()}/${bucketName}/${cleanKey}`;
}

export async function uploadImageToNeon(filename: string, buffer: Uint8Array | Buffer, contentType = 'image/jpeg') {
  const cleanFilename = filename.replace(/[^a-zA-Z0-9._-]/g, '_');
  const timestamp = Date.now();
  const targetKey = `images/uploads/${timestamp}_${cleanFilename}`;

  const client = getS3Client();
  const command = new PutObjectCommand({
    Bucket: bucketName,
    Key: targetKey,
    Body: buffer,
    ContentType: contentType,
  });

  await client.send(command);

  // Return both relative key (for database img_url column) and full public URL
  return {
    key: targetKey,
    filename: `${timestamp}_${cleanFilename}`,
    url: getPublicStorageUrl(targetKey),
  };
}

export { bucketName, getS3Endpoint };
