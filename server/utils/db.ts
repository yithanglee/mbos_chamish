import { neon } from '@neondatabase/serverless';

function getDatabaseUrl(): string {
  const url = process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL || '';
  if (!url) {
    console.warn('DATABASE_URL is not set in environment!');
  }
  return url;
}

export function getDb() {
  return neon(getDatabaseUrl());
}

export function normalizeImgUrl(url?: string | null): string {
  if (!url || typeof url !== 'string') return '';
  return url.replace(/^\/+/, '');
}

export function normalizeProduct(p: any) {
  if (!p) return null;
  return {
    ...p,
    id: typeof p.id === 'string' ? parseInt(p.id, 10) : p.id,
    category_id: p.category_id ? (typeof p.category_id === 'string' ? parseInt(p.category_id, 10) : p.category_id) : null,
    brand_id: p.brand_id ? (typeof p.brand_id === 'string' ? parseInt(p.brand_id, 10) : p.brand_id) : null,
    balance: p.balance !== null && p.balance !== undefined ? parseInt(p.balance, 10) : null,
    img_url: normalizeImgUrl(p.img_url),
    img_url2: normalizeImgUrl(p.img_url2),
    img_url3: normalizeImgUrl(p.img_url3),
    img_url4: normalizeImgUrl(p.img_url4),
    img_url5: normalizeImgUrl(p.img_url5),
    img_url6: normalizeImgUrl(p.img_url6),
  };
}

export function normalizeSlide(s: any) {
  if (!s) return null;
  return {
    ...s,
    id: typeof s.id === 'string' ? parseInt(s.id, 10) : s.id,
    order: s.order || 0,
    img_url: normalizeImgUrl(s.img_url),
    mobile_img_url: normalizeImgUrl(s.mobile_img_url),
  };
}

export async function getProducts(options?: { category_id?: number; brand_id?: number; search?: string }) {
  const sql = getDb();
  let query = 'SELECT * FROM products WHERE 1=1';
  const params: any[] = [];

  // We can fetch categories & brands in parallel
  const [productsRaw, categories, brands] = await Promise.all([
    sql`SELECT * FROM products ORDER BY id ASC`,
    sql`SELECT * FROM categories ORDER BY id ASC`,
    sql`SELECT * FROM brands ORDER BY id ASC`,
  ]);

  let products = productsRaw.map(normalizeProduct);

  if (options?.category_id) {
    products = products.filter(p => p.category_id === options.category_id);
  }
  if (options?.brand_id) {
    products = products.filter(p => p.brand_id === options.brand_id);
  }
  if (options?.search) {
    const s = options.search.toLowerCase();
    products = products.filter(p => (p.name && p.name.toLowerCase().includes(s)) || (p.short_desc && p.short_desc.toLowerCase().includes(s)));
  }

  return { categories, brands, products };
}

export async function getProductById(id: number | string) {
  const sql = getDb();
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  const rows = await sql`SELECT * FROM products WHERE id = ${numId} LIMIT 1`;
  return rows[0] ? normalizeProduct(rows[0]) : null;
}

export async function createProduct(data: {
  name: string;
  short_desc?: string;
  desc?: string;
  category_id?: number | null;
  brand_id?: number | null;
  img_url?: string;
  img_url2?: string;
  img_url3?: string;
  img_url4?: string;
  img_url5?: string;
  img_url6?: string;
  balance?: number;
}) {
  const sql = getDb();
  // Get next available id
  const idRes = await sql`SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM products`;
  const nextId = parseInt(idRes[0].next_id, 10);

  const rows = await sql`
    INSERT INTO products (
      id, name, short_desc, "desc", category_id, brand_id,
      img_url, img_url2, img_url3, img_url4, img_url5, img_url6,
      balance, inserted_at, updated_at
    ) VALUES (
      ${nextId},
      ${data.name || ''},
      ${data.short_desc || null},
      ${data.desc || null},
      ${data.category_id || null},
      ${data.brand_id || null},
      ${normalizeImgUrl(data.img_url) || null},
      ${normalizeImgUrl(data.img_url2) || null},
      ${normalizeImgUrl(data.img_url3) || null},
      ${normalizeImgUrl(data.img_url4) || null},
      ${normalizeImgUrl(data.img_url5) || null},
      ${normalizeImgUrl(data.img_url6) || null},
      ${data.balance !== undefined && data.balance !== null ? data.balance : 0},
      NOW(), NOW()
    ) RETURNING *
  `;
  return normalizeProduct(rows[0]);
}

export async function updateProduct(id: number | string, data: Partial<{
  name: string;
  short_desc: string;
  desc: string;
  category_id: number | null;
  brand_id: number | null;
  img_url: string;
  img_url2: string;
  img_url3: string;
  img_url4: string;
  img_url5: string;
  img_url6: string;
  balance: number;
}>) {
  const sql = getDb();
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  const existing = await getProductById(numId);
  if (!existing) {
    return null;
  }

  const updatedName = data.name !== undefined ? data.name : existing.name;
  const updatedShortDesc = data.short_desc !== undefined ? data.short_desc : existing.short_desc;
  const updatedDesc = data.desc !== undefined ? data.desc : existing.desc;
  const updatedCatId = data.category_id !== undefined ? data.category_id : existing.category_id;
  const updatedBrandId = data.brand_id !== undefined ? data.brand_id : existing.brand_id;
  const updatedImg = data.img_url !== undefined ? normalizeImgUrl(data.img_url) : existing.img_url;
  const updatedImg2 = data.img_url2 !== undefined ? normalizeImgUrl(data.img_url2) : existing.img_url2;
  const updatedImg3 = data.img_url3 !== undefined ? normalizeImgUrl(data.img_url3) : existing.img_url3;
  const updatedImg4 = data.img_url4 !== undefined ? normalizeImgUrl(data.img_url4) : existing.img_url4;
  const updatedImg5 = data.img_url5 !== undefined ? normalizeImgUrl(data.img_url5) : existing.img_url5;
  const updatedImg6 = data.img_url6 !== undefined ? normalizeImgUrl(data.img_url6) : existing.img_url6;
  const updatedBalance = data.balance !== undefined ? data.balance : existing.balance;

  const rows = await sql`
    UPDATE products SET
      name = ${updatedName},
      short_desc = ${updatedShortDesc},
      "desc" = ${updatedDesc},
      category_id = ${updatedCatId},
      brand_id = ${updatedBrandId},
      img_url = ${updatedImg},
      img_url2 = ${updatedImg2},
      img_url3 = ${updatedImg3},
      img_url4 = ${updatedImg4},
      img_url5 = ${updatedImg5},
      img_url6 = ${updatedImg6},
      balance = ${updatedBalance},
      updated_at = NOW()
    WHERE id = ${numId}
    RETURNING *
  `;
  return normalizeProduct(rows[0]);
}

export async function deleteProduct(id: number | string) {
  const sql = getDb();
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  await sql`DELETE FROM products WHERE id = ${numId}`;
  return { success: true, id: numId };
}

export async function getCategories() {
  const sql = getDb();
  return await sql`SELECT * FROM categories ORDER BY id ASC`;
}

export async function getBrands() {
  const sql = getDb();
  return await sql`SELECT * FROM brands ORDER BY id ASC`;
}

export async function getSections() {
  const sql = getDb();
  const sections = await sql`SELECT * FROM sections ORDER BY id ASC`;
  return sections.map((s: any) => ({
    ...s,
    id: typeof s.id === 'string' ? parseInt(s.id, 10) : s.id,
  }));
}

export async function getSectionByName(name: string) {
  const sql = getDb();
  const rows = await sql`SELECT * FROM sections WHERE name = ${name} LIMIT 1`;
  if (!rows[0]) return null;
  const s = rows[0];
  return {
    ...s,
    id: typeof s.id === 'string' ? parseInt(s.id, 10) : s.id,
  };
}

export async function updateSection(id: number | string, data: any) {
  const sql = getDb();
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  const rows = await sql`
    UPDATE sections SET
      name = COALESCE(${data.name}, name),
      class_list = COALESCE(${data.class_list}, class_list),
      content1 = COALESCE(${data.content1}, content1),
      content2 = COALESCE(${data.content2}, content2),
      content3 = COALESCE(${data.content3}, content3),
      content4 = COALESCE(${data.content4}, content4),
      plain_content1 = COALESCE(${data.plain_content1}, plain_content1),
      plain_content2 = COALESCE(${data.plain_content2}, plain_content2),
      plain_content3 = COALESCE(${data.plain_content3}, plain_content3),
      plain_content4 = COALESCE(${data.plain_content4}, plain_content4),
      updated_at = NOW()
    WHERE id = ${numId}
    RETURNING *
  `;
  return rows[0] || null;
}

export async function getBanners() {
  const sql = getDb();
  const rows = await sql`SELECT * FROM slides WHERE is_show = true ORDER BY "order" ASC, id ASC`;
  return rows.map(normalizeSlide);
}

export async function getAllBanners() {
  const sql = getDb();
  const rows = await sql`SELECT * FROM slides ORDER BY "order" ASC, id ASC`;
  return rows.map(normalizeSlide);
}

export async function createBanner(data: {
  order?: number;
  img_url: string;
  mobile_img_url?: string;
  remarks?: string;
  is_show?: boolean;
  content?: string;
  is_banner?: boolean;
}) {
  const sql = getDb();
  const idRes = await sql`SELECT COALESCE(MAX(id), 0) + 1 AS next_id FROM slides`;
  const nextId = parseInt(idRes[0].next_id, 10);

  const rows = await sql`
    INSERT INTO slides (
      id, "order", mobile_img_url, img_url, remarks, is_show, content, is_banner, inserted_at, updated_at
    ) VALUES (
      ${nextId},
      ${data.order || 0},
      ${normalizeImgUrl(data.mobile_img_url) || null},
      ${normalizeImgUrl(data.img_url) || null},
      ${data.remarks || null},
      ${data.is_show !== undefined ? data.is_show : true},
      ${data.content || null},
      ${data.is_banner !== undefined ? data.is_banner : true},
      NOW(), NOW()
    ) RETURNING *
  `;
  return normalizeSlide(rows[0]);
}

export async function updateBanner(id: number | string, data: any) {
  const sql = getDb();
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  const rows = await sql`
    UPDATE slides SET
      "order" = COALESCE(${data.order}, "order"),
      img_url = COALESCE(${data.img_url ? normalizeImgUrl(data.img_url) : null}, img_url),
      mobile_img_url = COALESCE(${data.mobile_img_url ? normalizeImgUrl(data.mobile_img_url) : null}, mobile_img_url),
      remarks = COALESCE(${data.remarks}, remarks),
      is_show = COALESCE(${data.is_show}, is_show),
      content = COALESCE(${data.content}, content),
      updated_at = NOW()
    WHERE id = ${numId}
    RETURNING *
  `;
  return rows[0] ? normalizeSlide(rows[0]) : null;
}

export async function deleteBanner(id: number | string) {
  const sql = getDb();
  const numId = typeof id === 'string' ? parseInt(id, 10) : id;
  await sql`DELETE FROM slides WHERE id = ${numId}`;
  return { success: true, id: numId };
}

export async function getPages() {
  const sql = getDb();
  const pages = await sql`SELECT * FROM pages ORDER BY sorting_index ASC, id ASC`;
  return pages.map((p: any) => ({
    ...p,
    id: typeof p.id === 'string' ? parseInt(p.id, 10) : p.id,
    img_url: normalizeImgUrl(p.img_url),
  }));
}

export async function getContact() {
  return await getSectionByName('Top Nav Contact');
}
