const esbuild = require('esbuild');

// Run esbuild build process
esbuild.build({
  entryPoints: ['./internal/js/app.js'], // Specify your entry file here
  bundle: true,
  minify: true,
  sourcemap: true,
  target: ['es6'], // Specify target environment
  outfile: 'public/bundle.js', // Output file
}).catch(() => process.exit(1));
