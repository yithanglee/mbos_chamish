import { defineEventHandler, readMultipartFormData, readBody, getHeader, createError } from 'h3';
import { uploadImageToNeon } from '../../../utils/storage';
import { requireAuth } from '../../../utils/auth';

export default defineEventHandler(async (event) => {
  await requireAuth(event);

  const contentType = getHeader(event, 'content-type') || '';

  // 1. Handle multipart form data (browser file uploads)
  if (contentType.includes('multipart/form-data')) {
    const formData = await readMultipartFormData(event);
    if (!formData || formData.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'No file uploaded in form data' });
    }

    const fileField = formData.find(f => f.name === 'file' || f.name === 'image') || formData[0];
    if (!fileField || !fileField.data) {
      throw createError({ statusCode: 400, statusMessage: 'Missing file data' });
    }

    const filename = fileField.filename || `upload_${Date.now()}.jpg`;
    const mime = fileField.type || 'image/jpeg';

    const result = await uploadImageToNeon(filename, fileField.data, mime);
    return {
      success: true,
      url: result.url,
      key: result.key,
      filename: result.filename,
    };
  }

  // 2. Handle JSON base64 uploads (ideal for AI Agents)
  const body = await readBody(event);
  if (!body) {
    throw createError({ statusCode: 400, statusMessage: 'Request body required' });
  }

  let buffer: Buffer;
  let filename = body.filename || `agent_upload_${Date.now()}.jpg`;
  let mime = body.contentType || 'image/jpeg';

  if (body.data && typeof body.data === 'string') {
    // Check if data URL
    const match = body.data.match(/^data:([^;]+);base64,(.+)$/);
    if (match) {
      mime = match[1];
      buffer = Buffer.from(match[2], 'base64');
    } else {
      buffer = Buffer.from(body.data, 'base64');
    }
  } else if (body.base64 && typeof body.base64 === 'string') {
    buffer = Buffer.from(body.base64, 'base64');
  } else {
    throw createError({
      statusCode: 400,
      statusMessage: 'Provide either multipart form-data or JSON with { filename, data: "<base64>" }',
    });
  }

  const result = await uploadImageToNeon(filename, buffer, mime);
  return {
    success: true,
    url: result.url,
    key: result.key,
    filename: result.filename,
  };
});
