import { getPublishedHomepage } from '../utils/homepage';
import { defineEventHandler, getQuery, setResponseHeader } from 'h3';
import { getProducts, getProductById, getSections, getBanners, getPageByRoute } from '../utils/db';
import { getPublicStorageUrl, getS3Endpoint, bucketName } from '../utils/storage';
import { renderTemplate, blogNavContent } from '../utils/renderer';
import { buildNumber, buildTime } from '../utils/compiled-templates';

export default defineEventHandler(async (event) => {
  const urlPath = event.path.split('?')[0];

  // Never serve HTML for static assets, API, or admin routes
  if (
    urlPath.startsWith('/api/') ||
    urlPath.startsWith('/admin') ||
    urlPath.startsWith('/js/') ||
    urlPath.startsWith('/css/') ||
    urlPath.startsWith('/img/') ||
    urlPath.startsWith('/fonts/') ||
    urlPath.startsWith('/scss/') ||
    urlPath.match(/\.(js|css|png|jpg|jpeg|gif|webp|svg|ico|woff2?|ttf|eot|map|json|txt|xml)$/i)
  ) {
    return;
  }

  setResponseHeader(event, 'content-type', 'text/html; charset=utf-8');

  if (process.env.HOMEPAGE_CMS_ENABLED === 'true' && (urlPath === '/' || urlPath === '/home')) {
    const html = await getPublishedHomepage();
    if (html) return html;
  }

  const assetsUrl = getPublicStorageUrl('');
  const query = getQuery(event);

  // 1. Single Product route
  if (urlPath.startsWith('/single-product')) {
    const parts = urlPath.replace('/single-product', '').replace(/^\/+/, '');
    const productId = parts || (query.id as string);

    let product: any = {};
    if (productId) {
      product = (await getProductById(productId)) || {};
    }

    const [sections, banners] = await Promise.all([
      getSections(),
      getBanners(),
    ]);

    const data = {
      blogUrl: assetsUrl,
      assetsUrl: assetsUrl,
      product: product,
      sections: sections,
      banners: JSON.stringify(banners),
    };

    const renderVars = {
      page: 'single-product',
      useEjs: true,
      content: blogNavContent,
      data: data,
      product: product,
      buildNumber,
      buildTime,
    };

    const pageHtml = renderTemplate('pages/single-product', renderVars) || '';
    if (query.partial) {
      return pageHtml;
    }

    const fullHtml = renderTemplate('index', {
      ...renderVars,
      pageContent: pageHtml,
    });

    return fullHtml || '<h1>Storefront Rendering Error</h1>';
  }

  // 2. General Storefront Pages / Landing
  let cleanKey = urlPath.replace(/^\/+/, '');
  if (!cleanKey || cleanKey === 'home') {
    cleanKey = 'landing';
  }

  // Strip .html extension if requested
  cleanKey = cleanKey.replace(/\.html$/, '');

  const [fullData, banners, sections] = await Promise.all([
    getProducts(),
    getBanners(),
    getSections(),
  ]);

  let product: any = {};
  if (cleanKey === 'single-product' && query.id) {
    product = (await getProductById(query.id as string)) || {};
  }

  const data = {
    product: product,
    sections: sections,
    blogUrl: assetsUrl,
    assetsUrl: assetsUrl,
    banners: JSON.stringify(banners),
    products: fullData.products,
    categories: fullData.categories,
    brands: fullData.brands,
  };

  const renderVars = {
    page: cleanKey,
    useEjs: true,
    content: blogNavContent,
    data: data,
    product: product,
    buildNumber,
    buildTime,
  };

  let pageHtml = renderTemplate(`pages/${cleanKey}`, renderVars);
  if (!pageHtml) {
    const dbPage = await getPageByRoute(cleanKey);
    if (dbPage && dbPage.content) {
      pageHtml = dbPage.content;
    } else {
      pageHtml = renderTemplate('pages/landing', renderVars) || '';
    }
  }
  if (query.partial) {
    return pageHtml;
  }

  const fullHtml = renderTemplate('index', {
    ...renderVars,
    pageContent: pageHtml,
  });

  return fullHtml || '<h1>Storefront Rendering Error</h1>';
});
