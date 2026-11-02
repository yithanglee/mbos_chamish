import { compiledTemplates, rawBlogNavContent } from './compiled-templates';

export function renderTemplate(name: string, vars: any): string | null {
  const fn = compiledTemplates[name];
  if (!fn) return null;
  try {
    return fn(vars);
  } catch (err) {
    console.error(`Error executing precompiled template ${name}:`, err);
    return null;
  }
}

export const blogNavContent = rawBlogNavContent;
