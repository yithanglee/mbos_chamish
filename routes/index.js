var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const he = require('he');
require('dotenv').config();

const db = require('../lib/db');
const storage = require('../lib/storage');
const assetsUrl = `${storage.s3Endpoint}/${storage.bucketName}`;

/* GET product page. */
router.get('/single-product/*', async function (req, res, next) {
  var contentNav = '', content = '', filename = '';
  const productId = req.params[0] || req.query.id;

  let product = {};
  if (productId) {
    product = (await db.getProductById(productId)) || {};
  }

  const key = req.params[0] || '';
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
    content: finalContent,
    data: data,
    product: product,
  };

  if (Object.keys(req.query).includes('partial')) {
    res.render('pages/' + (key || 'single-product'), renderVars);
  } else {
    res.render('index', renderVars);
  }
});

/* GET general pages / home. */
router.get('/*', async function (req, res, next) {
  var contentNav = '', content = '', filename = '';
  const key = req.params[0] || '';
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
    content: finalContent,
    data: data,
    product: product,
  };

  if (Object.keys(req.query).includes('partial')) {
    res.render('pages/' + (key || 'landing'), renderVars);
  } else {
    res.render('index', renderVars);
  }
});

module.exports = router;
