import { httpServerHandler } from 'cloudflare:node';
import http from 'node:http';
import app from './app.js';

const server = http.createServer(app).listen(8080);
export default httpServerHandler(server);
