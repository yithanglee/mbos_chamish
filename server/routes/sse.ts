import { defineEventHandler, setResponseHeader } from 'h3';

export default defineEventHandler((event) => {
  setResponseHeader(event, 'content-type', 'text/event-stream; charset=utf-8');
  setResponseHeader(event, 'cache-control', 'no-cache, no-transform');
  setResponseHeader(event, 'connection', 'keep-alive');

  // Standard MCP SSE handshake: specify the POST endpoint where JSON-RPC calls are sent
  return `event: endpoint\ndata: /mcp\n\n`;
});
