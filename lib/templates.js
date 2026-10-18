const ejs = require('ejs');
const raw = require('./template-strings');

const compiled = {};

// Precompile all templates once at module load (startup)
for (const key of Object.keys(raw)) {
  if (key !== 'blog_nav' && raw[key] && typeof raw[key] === 'string') {
    try {
      compiled[key] = ejs.compile(raw[key]);
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
  blog_nav: raw['blog_nav'] || '',
};