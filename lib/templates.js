const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const raw = { index: fs.readFileSync(path.join(__dirname, '../views/index.ejs'), 'utf8'),
  blog_nav: fs.readFileSync(path.join(__dirname, '../internal/html/blog_nav.html'), 'utf8') };
for (const name of fs.readdirSync(path.join(__dirname, '../views/pages'))) {
  if (name.endsWith('.ejs')) raw['pages/' + name.slice(0, -4)] = fs.readFileSync(path.join(__dirname, '../views/pages', name), 'utf8');
}
function localUrls(text) {
  return text.replace(/https?:\/\/[^\s"'<>)]*\.neon\.tech\/assets\/images\/uploads\//g, '/images/uploads/')
    .replace(/https?:\/\/blog\.damienslab\.com\/images\/uploads\//g, '/images/uploads/');
}

const compiled = {};

// Precompile all templates once at module load (startup)
for (const key of Object.keys(raw)) {
  if (key !== 'blog_nav' && raw[key] && typeof raw[key] === 'string') {
    try {
      compiled[key] = ejs.compile(localUrls(raw[key]));
    } catch (err) {
      console.error(`Error compiling template ${key}:`, err);
    }
  }
}

function render(name, vars) {
  const fn = compiled[name];
  if (!fn) return null;
  try {
    return fn(vars);
  } catch (err) {
    console.error(`Error rendering template ${name}:`, err);
    return null;
  }
}

module.exports = {
  render,
  blog_nav: localUrls(raw['blog_nav'] || ''),
};