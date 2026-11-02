import ejs from 'ejs';
import templateStrings from './template-strings';

const compiled: Record<string, (vars: any) => string> = {};

for (const key of Object.keys(templateStrings)) {
  if (key !== 'blog_nav' && templateStrings[key]) {
    try {
      compiled[key] = ejs.compile(templateStrings[key]);
    } catch (err) {
      console.error(`Error compiling template ${key}:`, err);
    }
  }
}

export function renderTemplate(name: string, vars: any): string | null {
  const fn = compiled[name];
  if (!fn) return null;
  try {
    return fn(vars);
  } catch (err) {
    console.error(`Error rendering template ${name}:`, err);
    return null;
  }
}

export const blogNavContent = templateStrings['blog_nav'] || '';
