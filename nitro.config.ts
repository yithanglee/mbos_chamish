import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineNitroConfig({
  srcDir: 'server',
  preset: process.env.NITRO_PRESET || 'cloudflare-module',
  compatibilityDate: '2026-08-04',
  // Root HTML files are the purchased theme's demos, not customer pages.
  // Exclude them so Cloudflare's clean-URL asset serving cannot shadow SSR.
  // Keep html/v2 fragments used by the original navigation.
  ignore: ['legacy_express_routes/**', 'app.js', 'worker.js', 'bin/**', '../public/*.html'],
  publicAssets: [
    {
      baseURL: '/',
      dir: resolve(__dirname, 'public'),
      maxAge: 60 * 60 * 24 * 30,
    },
  ],
  routeRules: {
    '/api/**': { cors: true },
  },
  unenv: {
    // Allows Node compatibility builtins on edge runtimes
  },
});
