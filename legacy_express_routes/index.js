var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const he = require('he');
const ejs = require('ejs');
require('dotenv').config();

const db = require('../lib/db');
const templates = require('../lib/templates');
const assetsUrl = '';
const asyncRoute = handler => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

function renderTemplate(name, vars) {
  return templates.render(name, vars);
}

/* GET product page. */
router.get('/single-product/*', asyncRoute(async function (req, res, next) {
  var contentNav = '', content = '', filename = '';
  const productId = req.params[0] || req.query.id;

  let product = {};
  if (productId) {
    product = (await db.getProductById(productId)) || {};
  }

  const key = req.params[0] || '';
  if (key && !/^[a-zA-Z0-9_-]+$/.test(key)) return res.sendStatus(404);
  switch (key) {
    case 'home':
    case '':
      filename = 'landing.html';
      break;
    default:
      filename = 'single-product.html';
  }

  const filePathNav = path.join(__dirname, '../internal/html/', 'blog_nav.html');
  try {
    contentNav = await fs.readFile(filePathNav);
  } catch (e) {}

  const decodedHtmlNav = he.decode(Buffer.from(contentNav).toString());
  const filePath = path.join(__dirname, '../internal/html/', filename);
  try {
    content = await fs.readFile(filePath);
  } catch (e) {}

  const decodedHtml = he.decode(Buffer.from(content).toString());
  const finalContent = decodedHtmlNav + decodedHtml;
  const [sections, banners] = await Promise.all([
    db.getSections(),
    db.getBanners(),
  ]);

  const data = {
    blogUrl: assetsUrl,
    assetsUrl: assetsUrl,
    product: product,
    sections: sections,
    banners: JSON.stringify(banners),
  };

  const renderVars = {
    page: filename.replace('.html', ''),
    useEjs: decodedHtml.length === 0,
    content: templates['blog_nav'] || finalContent,
    data: data,
    product: product,
    buildNumber: res.locals.buildNumber,
    buildTime: res.locals.buildTime,
  };

  const pageKey = (key === 'home' || key === '') ? 'pages/landing' : 'pages/single-product';
  const pageHtml = renderTemplate(pageKey, renderVars);

  if (Object.keys(req.query).includes('partial')) {
    if (pageHtml) return res.send(pageHtml);
    return res.render('pages/' + (key || 'single-product'), renderVars);
  }

  const fullHtml = renderTemplate('index', {
    ...renderVars,
    pageContent: pageHtml,
  });

  if (fullHtml) return res.send(fullHtml);
  return res.render('index', renderVars);
}));

/* GET general pages / home. */
router.get('/*', asyncRoute(async function (req, res, next) {
  var contentNav = '', content = '', filename = '';
  const key = req.params[0] || '';
  if (key && !/^[a-zA-Z0-9_-]+$/.test(key)) return res.sendStatus(404);
  switch (key) {
    case 'home':
    case '':
      filename = 'landing.html';
      break;
    default:
      filename = key + '.html';
  }

  const filePathNav = path.join(__dirname, '../internal/html/', 'blog_nav.html');
  try {
    contentNav = await fs.readFile(filePathNav);
  } catch (e) {}

  const decodedHtmlNav = he.decode(Buffer.from(contentNav).toString());
  const filePath = path.join(__dirname, '../internal/html/', filename);
  try {
    content = await fs.readFile(filePath);
  } catch (e) {}

  const decodedHtml = he.decode(Buffer.from(content).toString());
  const finalContent = decodedHtmlNav + decodedHtml;

  const [full_data, banners, sections] = await Promise.all([
    db.getProducts(),
    db.getBanners(),
    db.getSections(),
  ]);

  let product = {};
  if (key === 'single-product' && req.query.id) {
    product = (await db.getProductById(req.query.id)) || {};
  }

  const data = {
    product: product,
    sections: sections,
    blogUrl: assetsUrl,
    assetsUrl: assetsUrl,
    banners: JSON.stringify(banners),
    products: full_data.products,
    categories: full_data.categories,
    brands: full_data.brands,
  };

  const renderVars = {
    page: filename.replace('.html', ''),
    useEjs: decodedHtml.length === 0,
    content: templates['blog_nav'] || finalContent,
    data: data,
    buildNumber: res.locals.buildNumber,
    buildTime: res.locals.buildTime,
  };

  const pageKey = (key === 'home' || key === '') ? 'pages/landing' : ('pages/' + key);
  const savedPage = key && key !== 'home' ? (await db.getPages()).find(p => p.route_name.replace(/^\//, '') === key) : null;
  const pageHtml = savedPage?.content
    ? ejs.render(savedPage.content, renderVars)
    : renderTemplate(pageKey, renderVars);

  if (Object.keys(req.query).includes('partial')) {
    if (pageHtml) return res.send(pageHtml);
    return res.render('pages/' + (key || 'landing'), renderVars);
  }

  const fullHtml = renderTemplate('index', {
    ...renderVars,
    pageContent: pageHtml,
  });

  if (fullHtml) return res.send(fullHtml);
  return res.render('index', renderVars);
}));

module.exports = router;
