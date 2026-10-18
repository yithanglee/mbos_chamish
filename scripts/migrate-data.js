require('dotenv').config();
const axios = require('axios');
const { neon } = require('@neondatabase/serverless');
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const path = require('path');

const sql = neon(process.env.DATABASE_URL_UNPOOLED || process.env.DATABASE_URL);

const s3 = new S3Client({
  region: process.env.AWS_REGION || 'ap-southeast-1',
  endpoint: process.env.AWS_ENDPOINT_URL_S3,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
  forcePathStyle: true,
});

const BUCKET = 'assets';
const STORAGE_ENDPOINT = process.env.AWS_ENDPOINT_URL_S3.replace(/\/$/, '');
const NEON_IMAGE_BASE = `${STORAGE_ENDPOINT}/${BUCKET}/images/uploads`;

async function createSchema() {
  console.log('--- Creating schema in Neon Postgres ---');

  await sql`
    CREATE TABLE IF NOT EXISTS categories (
      id BIGINT PRIMARY KEY,
      name VARCHAR(255),
      "desc" VARCHAR(255),
      parent_id INTEGER,
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS brands (
      id BIGINT PRIMARY KEY,
      name VARCHAR(255),
      "desc" TEXT,
      short_desc TEXT,
      img_url VARCHAR(255),
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS products (
      id BIGINT PRIMARY KEY,
      name VARCHAR(255),
      short_desc TEXT,
      "desc" TEXT,
      category_id INTEGER REFERENCES categories(id) ON DELETE SET NULL,
      brand_id INTEGER REFERENCES brands(id) ON DELETE SET NULL,
      img_url VARCHAR(255),
      img_url2 VARCHAR(255),
      img_url3 VARCHAR(255),
      img_url4 VARCHAR(255),
      img_url5 VARCHAR(255),
      img_url6 VARCHAR(255),
      balance INTEGER,
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS sections (
      id BIGINT PRIMARY KEY,
      name VARCHAR(255),
      class_list VARCHAR(255),
      content1 TEXT,
      content1_class_list VARCHAR(255),
      content2 TEXT,
      content2_class_list VARCHAR(255),
      content3 TEXT,
      content3_class_list VARCHAR(255),
      content4 TEXT,
      content4_class_list VARCHAR(255),
      plain_content1 VARCHAR(255),
      plain_content2 VARCHAR(255),
      plain_content3 VARCHAR(255),
      plain_content4 VARCHAR(255),
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS slides (
      id BIGINT PRIMARY KEY,
      "order" INTEGER DEFAULT 0,
      mobile_img_url VARCHAR(255),
      img_url VARCHAR(255),
      remarks VARCHAR(255),
      is_show BOOLEAN DEFAULT false,
      content TEXT,
      is_banner BOOLEAN DEFAULT false,
      class_list VARCHAR(255) DEFAULT 'col-lg-4 col-sm-6 col-12',
      youtube_url VARCHAR(255),
      is_djtech BOOLEAN DEFAULT false,
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS pages (
      id BIGINT PRIMARY KEY,
      name VARCHAR(255),
      subtitle VARCHAR(255),
      content TEXT,
      img_url VARCHAR(255),
      route_name VARCHAR(255),
      file_name VARCHAR(255),
      sorting_index INTEGER DEFAULT 0,
      show_nav BOOLEAN DEFAULT true,
      inserted_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT NOW()
    );
  `;

  console.log('Schema created successfully!');
}

async function uploadImageToNeon(filename) {
  // filename could be "w101.jpg" or "All%20OZS%20W101%20Colors.jpg" or "All OZS W101 Colors.jpg"
  const cleanFilename = decodeURIComponent(filename).replace(/^\/?images\/uploads\//, '');
  const encodedFilename = encodeURIComponent(cleanFilename);
  const downloadUrl = `https://blog.damienslab.com/images/uploads/${encodedFilename}`;
  const key = `images/uploads/${cleanFilename}`;

  try {
    const resp = await axios.get(downloadUrl, { responseType: 'arraybuffer', timeout: 15000 });
    let contentType = resp.headers['content-type'];
    if (!contentType || contentType === 'application/octet-stream') {
      const ext = path.extname(cleanFilename).toLowerCase();
      if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg';
      else if (ext === '.png') contentType = 'image/png';
      else if (ext === '.webp') contentType = 'image/webp';
      else if (ext === '.gif') contentType = 'image/gif';
      else if (ext === '.svg') contentType = 'image/svg+xml';
      else contentType = 'image/jpeg';
    }

    await s3.send(new PutObjectCommand({
      Bucket: BUCKET,
      Key: key,
      Body: resp.data,
      ContentType: contentType,
    }));
    console.log(`[Storage] Uploaded: ${key} (${resp.data.length} bytes, ${contentType})`);
    return true;
  } catch (err) {
    console.error(`[Storage] Failed to upload ${cleanFilename} from ${downloadUrl}:`, err.message);
    return false;
  }
}

function rewriteImageUrls(text) {
  if (!text || typeof text !== 'string') return text;
  // Replace https://blog.damienslab.com/images/uploads/ with Neon storage URL
  return text.replace(/https:\/\/blog\.damienslab\.com\/images\/uploads\//g, `${NEON_IMAGE_BASE}/`);
}

async function migrate() {
  await createSchema();

  console.log('\n--- Fetching live data from blog_engine API ---');
  const [productsData, banners, sections, pages] = await Promise.all([
    axios.get('https://blog.damienslab.com/api/webhook?scope=get_products').then(r => r.data),
    axios.get('https://blog.damienslab.com/api/webhook?scope=get_banners').then(r => r.data),
    axios.get('https://blog.damienslab.com/api/webhook?scope=get_sections').then(r => r.data),
    axios.get('https://blog.damienslab.com/api/webhook?scope=get_pages').then(r => r.data),
  ]);

  // Fetch full product details for each product
  const fullProducts = await Promise.all(
    productsData.products.map(async (p) => {
      try {
        const full = await axios.get(`https://blog.damienslab.com/api/webhook?scope=get_product&id=${p.id}`).then(r => r.data);
        return { ...p, ...full };
      } catch (e) {
        return p;
      }
    })
  );

  console.log(`Fetched ${fullProducts.length} products, ${productsData.brands.length} brands, ${productsData.categories.length} categories, ${banners.length} banners, ${sections.length} sections, ${pages.length} pages.`);

  // Collect all images
  const images = new Set();
  function addImg(url) {
    if (!url || typeof url !== 'string') return;
    const match = url.match(/([^\s"'"'"'<>\)\/\\]+\.(png|jpg|jpeg|webp|gif|svg))/i);
    if (match) {
      images.add(decodeURIComponent(match[1]));
    }
  }

  function extractImages(text) {
    if (!text || typeof text !== 'string') return;
    const matches = text.match(/images\/uploads\/([^\s"'"'"'<>\)\/\\]+\.(png|jpg|jpeg|webp|gif|svg))/gi) || [];
    matches.forEach(m => {
      const parts = m.split('/');
      const fn = parts[parts.length - 1];
      images.add(decodeURIComponent(fn));
    });
  }

  fullProducts.forEach(p => {
    ['img_url', 'img_url2', 'img_url3', 'img_url4', 'img_url5', 'img_url6', 'banner_img_url'].forEach(k => addImg(p[k]));
    extractImages(p.desc);
    extractImages(p.short_desc);
  });

  banners.forEach(b => {
    ['img_url', 'mobile_img_url'].forEach(k => addImg(b[k]));
    extractImages(b.content);
  });

  sections.forEach(s => {
    extractImages(s.content1);
    extractImages(s.content2);
    extractImages(s.content3);
    extractImages(s.content4);
  });

  pages.forEach(p => {
    addImg(p.img_url);
    extractImages(p.content);
  });

  console.log(`\n--- Migrating ${images.size} images to Neon Object Storage ---`);
  for (const img of images) {
    await uploadImageToNeon(img);
  }

  console.log('\n--- Inserting records into Neon Postgres ---');

  // Categories
  for (const c of productsData.categories) {
    await sql`
      INSERT INTO categories (id, name, "desc", parent_id, inserted_at, updated_at)
      VALUES (${c.id}, ${c.name}, ${c.desc || null}, ${c.parent_id || null}, ${c.inserted_at || new Date()}, ${c.updated_at || new Date()})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        "desc" = EXCLUDED."desc",
        parent_id = EXCLUDED.parent_id,
        updated_at = EXCLUDED.updated_at;
    `;
  }
  console.log(`Inserted ${productsData.categories.length} categories.`);

  // Brands
  for (const b of productsData.brands) {
    await sql`
      INSERT INTO brands (id, name, "desc", short_desc, img_url, inserted_at, updated_at)
      VALUES (${b.id}, ${b.name}, ${b.desc || null}, ${b.short_desc || null}, ${b.img_url || null}, ${b.inserted_at || new Date()}, ${b.updated_at || new Date()})
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        "desc" = EXCLUDED."desc",
        short_desc = EXCLUDED.short_desc,
        img_url = EXCLUDED.img_url,
        updated_at = EXCLUDED.updated_at;
    `;
  }
  console.log(`Inserted ${productsData.brands.length} brands.`);

  // Products
  for (const p of fullProducts) {
    await sql`
      INSERT INTO products (
        id, name, short_desc, "desc", category_id, brand_id,
        img_url, img_url2, img_url3, img_url4, img_url5, img_url6,
        balance, inserted_at, updated_at
      )
      VALUES (
        ${p.id}, ${p.name}, ${rewriteImageUrls(p.short_desc)}, ${rewriteImageUrls(p.desc)},
        ${p.category_id || null}, ${p.brand_id || null},
        ${p.img_url || null}, ${p.img_url2 || null}, ${p.img_url3 || null},
        ${p.img_url4 || null}, ${p.img_url5 || null}, ${p.img_url6 || null},
        ${p.balance || null}, ${p.inserted_at || new Date()}, ${p.updated_at || new Date()}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        short_desc = EXCLUDED.short_desc,
        "desc" = EXCLUDED."desc",
        category_id = EXCLUDED.category_id,
        brand_id = EXCLUDED.brand_id,
        img_url = EXCLUDED.img_url,
        img_url2 = EXCLUDED.img_url2,
        img_url3 = EXCLUDED.img_url3,
        img_url4 = EXCLUDED.img_url4,
        img_url5 = EXCLUDED.img_url5,
        img_url6 = EXCLUDED.img_url6,
        balance = EXCLUDED.balance,
        updated_at = EXCLUDED.updated_at;
    `;
  }
  console.log(`Inserted ${fullProducts.length} products.`);

  // Sections
  for (const s of sections) {
    await sql`
      INSERT INTO sections (
        id, name, class_list,
        content1, content1_class_list,
        content2, content2_class_list,
        content3, content3_class_list,
        content4, content4_class_list,
        plain_content1, plain_content2, plain_content3, plain_content4,
        inserted_at, updated_at
      )
      VALUES (
        ${s.id}, ${s.name}, ${s.class_list || null},
        ${rewriteImageUrls(s.content1)}, ${s.content1_class_list || null},
        ${rewriteImageUrls(s.content2)}, ${s.content2_class_list || null},
        ${rewriteImageUrls(s.content3)}, ${s.content3_class_list || null},
        ${rewriteImageUrls(s.content4)}, ${s.content4_class_list || null},
        ${s.plain_content1 || null}, ${s.plain_content2 || null}, ${s.plain_content3 || null}, ${s.plain_content4 || null},
        ${s.inserted_at || new Date()}, ${s.updated_at || new Date()}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        class_list = EXCLUDED.class_list,
        content1 = EXCLUDED.content1,
        content1_class_list = EXCLUDED.content1_class_list,
        content2 = EXCLUDED.content2,
        content2_class_list = EXCLUDED.content2_class_list,
        content3 = EXCLUDED.content3,
        content3_class_list = EXCLUDED.content3_class_list,
        content4 = EXCLUDED.content4,
        content4_class_list = EXCLUDED.content4_class_list,
        plain_content1 = EXCLUDED.plain_content1,
        plain_content2 = EXCLUDED.plain_content2,
        plain_content3 = EXCLUDED.plain_content3,
        plain_content4 = EXCLUDED.plain_content4,
        updated_at = EXCLUDED.updated_at;
    `;
  }
  console.log(`Inserted ${sections.length} sections.`);

  // Slides / Banners
  for (const b of banners) {
    await sql`
      INSERT INTO slides (
        id, "order", mobile_img_url, img_url, remarks,
        is_show, content, is_banner, class_list, youtube_url, is_djtech,
        inserted_at, updated_at
      )
      VALUES (
        ${b.id}, ${b.order || 0}, ${b.mobile_img_url || null}, ${b.img_url || null}, ${b.remarks || null},
        ${b.is_show ?? false}, ${rewriteImageUrls(b.content)}, ${b.is_banner ?? false},
        ${b.class_list || 'col-lg-4 col-sm-6 col-12'}, ${b.youtube_url || null}, ${b.is_djtech ?? false},
        ${b.inserted_at || new Date()}, ${b.updated_at || new Date()}
      )
      ON CONFLICT (id) DO UPDATE SET
        "order" = EXCLUDED."order",
        mobile_img_url = EXCLUDED.mobile_img_url,
        img_url = EXCLUDED.img_url,
        remarks = EXCLUDED.remarks,
        is_show = EXCLUDED.is_show,
        content = EXCLUDED.content,
        is_banner = EXCLUDED.is_banner,
        class_list = EXCLUDED.class_list,
        youtube_url = EXCLUDED.youtube_url,
        is_djtech = EXCLUDED.is_djtech,
        updated_at = EXCLUDED.updated_at;
    `;
  }
  console.log(`Inserted ${banners.length} slides.`);

  // Pages
  for (const p of pages) {
    await sql`
      INSERT INTO pages (
        id, name, subtitle, content, img_url,
        route_name, file_name, sorting_index, show_nav,
        inserted_at, updated_at
      )
      VALUES (
        ${p.id}, ${p.name}, ${p.subtitle || null}, ${rewriteImageUrls(p.content)}, ${p.img_url || null},
        ${p.route_name || null}, ${p.file_name || null}, ${p.sorting_index || 0}, ${p.show_nav ?? true},
        ${p.inserted_at || new Date()}, ${p.updated_at || new Date()}
      )
      ON CONFLICT (id) DO UPDATE SET
        name = EXCLUDED.name,
        subtitle = EXCLUDED.subtitle,
        content = EXCLUDED.content,
        img_url = EXCLUDED.img_url,
        route_name = EXCLUDED.route_name,
        file_name = EXCLUDED.file_name,
        sorting_index = EXCLUDED.sorting_index,
        show_nav = EXCLUDED.show_nav,
        updated_at = EXCLUDED.updated_at;
    `;
  }
  console.log(`Inserted ${pages.length} pages.`);

  console.log('\n--- Migration completed successfully! ---');
}

migrate().catch(err => {
  console.error('Migration failed:', err);
  process.exit(1);
});
