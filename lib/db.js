require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const databaseUrl = process.env.DATABASE_URL;
if (!databaseUrl) {
  console.warn('DATABASE_URL is not set in environment!');
}

const sql = neon(databaseUrl || '');

// Clean leading slashes from image URLs if present
function normalizeImgUrl(url) {
  if (!url || typeof url !== 'string') return url;
  return url.replace(/^\/+/, '');
}

function normalizeProduct(p) {
  if (!p) return p;
  return {
    ...p,
    id: typeof p.id === 'string' ? parseInt(p.id, 10) : p.id,
    img_url: normalizeImgUrl(p.img_url),
    img_url2: normalizeImgUrl(p.img_url2),
    img_url3: normalizeImgUrl(p.img_url3),
    img_url4: normalizeImgUrl(p.img_url4),
    img_url5: normalizeImgUrl(p.img_url5),
    img_url6: normalizeImgUrl(p.img_url6),
  };
}

function normalizeSlide(s) {
  if (!s) return s;
  return {
    ...s,
    id: typeof s.id === 'string' ? parseInt(s.id, 10) : s.id,
    img_url: normalizeImgUrl(s.img_url),
    mobile_img_url: normalizeImgUrl(s.mobile_img_url),
  };
}

async function getProducts() {
  const [productsRaw, categories, brands] = await Promise.all([
    sql`SELECT * FROM products ORDER BY id`,
    sql`SELECT * FROM categories ORDER BY id`,
    sql`SELECT * FROM brands ORDER BY id`,
  ]);

  const products = productsRaw.map(normalizeProduct);
  return { categories, brands, products };
}

async function getProductById(id) {
  const numId = parseInt(id, 10);
  const rows = await sql`SELECT * FROM products WHERE id = ${numId} LIMIT 1`;
  return rows[0] ? normalizeProduct(rows[0]) : null;
}

async function getSections() {
  const sections = await sql`SELECT * FROM sections ORDER BY id`;
  return sections.map(s => ({
    ...s,
    id: typeof s.id === 'string' ? parseInt(s.id, 10) : s.id,
  }));
}

async function getSectionByName(name) {
  const rows = await sql`SELECT * FROM sections WHERE name = ${name} LIMIT 1`;
  if (!rows[0]) return null;
  const s = rows[0];
  return {
    ...s,
    id: typeof s.id === 'string' ? parseInt(s.id, 10) : s.id,
  };
}

async function getBanners() {
  const rows = await sql`SELECT * FROM slides WHERE is_show = true ORDER BY "order" ASC, id ASC`;
  return rows.map(normalizeSlide);
}

async function getPages() {
  const pages = await sql`SELECT * FROM pages ORDER BY sorting_index ASC, id ASC`;
  return pages.map(p => ({
    ...p,
    id: typeof p.id === 'string' ? parseInt(p.id, 10) : p.id,
    img_url: normalizeImgUrl(p.img_url),
  }));
}

async function getContact() {
  return await getSectionByName('Top Nav Contact');
}

module.exports = {
  sql,
  getProducts,
  getProductById,
  getSections,
  getSectionByName,
  getBanners,
  getPages,
  getContact,
};
