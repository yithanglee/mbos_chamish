const esbuild = require('esbuild');
const builtins = new Set(require('module').builtinModules);

const nodePrefixPlugin = {
  name: 'node-prefix',
  setup(build) {
    build.onResolve({ filter: /^[a-z_0-9]+$/ }, args => {
      if (builtins.has(args.path)) {
        return { path: `node:${args.path}`, external: true };
      }
    });
  }
};

async function build() {
  await esbuild.build({
    entryPoints: ['worker.js'],
    bundle: true,
    format: 'esm',
    platform: 'node',
    target: 'es2022',
    outfile: 'dist/worker.js',
    external: ['node:*', 'cloudflare:*'],
    plugins: [nodePrefixPlugin],
    banner: {
      js: `import { createRequire } from "node:module"; const require = createRequire("/"); const __dirname = "/"; const __filename = "/worker.js";`
    }
  });
  console.log('Worker bundle created at dist/worker.js successfully!');
}

build().catch(err => {
  console.error('Failed to bundle worker:', err);
  process.exit(1);
});
