import { defineNitroConfig } from 'nitropack/config';

export default defineNitroConfig({
  preset: process.env.NITRO_PRESET || 'cloudflare-pages',
  compatibilityDate: '2026-08-04',
  publicAssets: [
    {
      baseURL: '/',
      dir: 'public',
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
