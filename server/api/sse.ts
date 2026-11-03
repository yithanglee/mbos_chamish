import { defineEventHandler } from 'h3';
import { handleSseRequest } from '../utils/mcpHandler';

export default defineEventHandler((event) => {
  return handleSseRequest(event);
});
