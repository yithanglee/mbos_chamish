import { defineEventHandler } from 'h3';
import { handleMcpRequest } from '../utils/mcpHandler';

export default defineEventHandler((event) => {
  return handleMcpRequest(event);
});
