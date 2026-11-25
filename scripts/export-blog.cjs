const fs = require('node:fs/promises');
const path = require('node:path');
const crypto = require('node:crypto');
const he = require('he');
const root = path.resolve(process.argv[2] || 'data/blog-export');
const origin = 'https://blog.damienslab.com';
async function get(scope, id) {
  const response = await fetch(`${origin}/api/webhook?scope=${scope}${id ? '&id=' + id : ''}`, {signal: AbortSignal.timeout(30000)});
  if (!response.ok) throw new Error(`${scope}: HTTP ${response.status}`);
  return response.json();
}
(async () => {
  await fs.mkdir(root, {recursive:true, mode:0o700});
  await fs.mkdir(path.join(root,'uploads'), {recursive:true});
  const catalog = await get('get_products');
  const data = {...catalog, slides:await get('get_banners'), sections:await get('get_sections'), pages:await get('get_pages')};
  data.products = await Promise.all(catalog.products.map(async p => ({...p, ...await get('get_product', p.id)})));
  await fs.writeFile(path.join(root,'source.json'), JSON.stringify(data,null,2), {mode:0o600});
  const images = new Set();
  function scan(value) {
    if (typeof value === 'string') {
      const text = he.decode(value);
      for (const match of text.matchAll(/images\/uploads\/([^"'<>\r\n]*?\.(?:png|jpe?g|gif|webp|svg|avif|pdf))/gi)) {
        const name = decodeURIComponent(match[1]);
        if (name !== path.basename(name) || name.includes('\\')) throw new Error('Unsafe upload path');
        images.add(name);
      }
    } else if (value && typeof value === 'object') Object.values(value).forEach(scan);
  }
  scan(data);
  // Bundled page templates may reference images absent from the API metadata.
  for (const file of await fs.readdir('views/pages')) scan(await fs.readFile(path.join('views/pages',file),'utf8'));
  const files = [], failures = [];
  for (const name of images) {
    const response = await fetch(`${origin}/images/uploads/${encodeURIComponent(name)}`, {signal:AbortSignal.timeout(30000)});
    if (!response.ok) { failures.push({name,status:response.status}); continue; }
    const bytes = Buffer.from(await response.arrayBuffer());
    await fs.writeFile(path.join(root,'uploads',name), bytes);
    files.push({name,bytes:bytes.length,sha256:crypto.createHash('sha256').update(bytes).digest('hex')});
  }
  const manifest = {source:origin, exportedAt:new Date().toISOString(), counts:Object.fromEntries(Object.entries(data).map(([k,v])=>[k,v.length])),files,failures};
  await fs.writeFile(path.join(root,'manifest.json'),JSON.stringify(manifest,null,2));
  console.log(JSON.stringify({...manifest,files:files.length},null,2));
  if(failures.length) process.exitCode=1;
})().catch(e=>{console.error(e.message);process.exitCode=1});
