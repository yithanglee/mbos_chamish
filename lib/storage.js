require('dotenv').config();
const { S3Client, GetObjectCommand, PutObjectCommand, HeadObjectCommand } = require('@aws-sdk/client-s3');

const s3Endpoint = process.env.AWS_ENDPOINT_URL_S3 ? process.env.AWS_ENDPOINT_URL_S3.replace(/\/$/, '') : '';
const bucketName = 'assets';

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
  forcePathStyle: true,
});

function getPublicUrl(key) {
  const cleanKey = key.replace(/^\/+/, '');
  return `${s3Endpoint}/${bucketName}/${cleanKey}`;
}

module.exports = {
  s3,
  bucketName,
  s3Endpoint,
  getPublicUrl,
  GetObjectCommand,
  PutObjectCommand,
  HeadObjectCommand,
};
