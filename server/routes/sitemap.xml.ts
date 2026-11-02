import { defineEventHandler, setResponseHeader } from 'h3';
import { getProducts } from '../../utils/db';

export default defineEventHandler(async (event) => {
  setResponseHeader(event, 'content-type', 'application/xml; charset=utf-8');

  const staticLinks = [
    { url: 'https://www.mbos.com.my/', changefreq: 'daily', priority: '1.0' },
    { url: 'https://www.mbos.com.my/about_us', changefreq: 'monthly', priority: '0.7' },
    { url: 'https://www.mbos.com.my/contact', changefreq: 'monthly', priority: '0.7' },
    { url: 'https://www.mbos.com.my/certifications', changefreq: 'monthly', priority: '0.7' },
    { url: 'https://www.mbos.com.my/products', changefreq: 'weekly', priority: '0.8' },
    { url: 'https://www.mbos.com.my/products_rx', changefreq: 'weekly', priority: '0.8' },
    { url: 'https://www.mbos.com.my/products_safety_spectacles', changefreq: 'weekly', priority: '0.8' },
  ];

  let productLinks: { url: string; changefreq: string; priority: string }[] = [];
  try {
    const data = await getProducts();
    if (data && data.products) {
      productLinks = data.products.map((p: any) => ({
        url: `https://www.mbos.com.my/single-product/${p.id}`,
        changefreq: 'weekly',
        priority: '0.8',
      }));
    }
  } catch (err) {
    console.error('Error generating product sitemap links:', err);
  }

  const allLinks = [...staticLinks, ...productLinks];

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${allLinks.map(l => `  <url>
    <loc>${l.url}</loc>
    <changefreq>${l.changefreq}</changefreq>
    <priority>${l.priority}</priority>
  </url>`).join('\n')}
</urlset>`;

  return xml;
});
