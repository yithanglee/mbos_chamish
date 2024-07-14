var express = require('express');
var router = express.Router();
const path = require('path');
const fs = require('fs/promises');
const he = require('he');
const axios = require('axios');
require('dotenv').config();
const blogUrl = process.env.BLOG_URL;

var products = []
async function api(url) {
  try {
    const apiUrl = url; // Replace with the actual API URL
    const response = await axios.get(apiUrl);
    // You can handle the response data here and send it back to the client
    return JSON.stringify(response.data)
  } catch (error) {
    console.error('Error calling external API:', error);

  }

}

/* GET product page. */
router.get('/single-product/*', async function (req, res, next) {
  var contentNav = '', content = '', filename = ''
  console.log(req.params)
  if (products.length == 0) {
    product = JSON.parse(await api(blogUrl + "/api/webhook?scope=get_product&id=" + req.params[0]))
  }

  var check = products.filter((v, i) => { return v.id == parseInt(req.params[0]) });
  if (check.length > 0) {
    product = check[0]
  }
  key = req.params[0]
  switch (key) {
    case "home":
      filename = "landing.html"
      break;
    case "":
      filename = "landing.html"
      break;
    default:
      filename = "single-product.html"
  }

  const filePathNav = path.join(__dirname, '../internal/html/', 'blog_nav.html');
  try {
    contentNav = await fs.readFile(filePathNav);
  } catch (e) {
  }
  const decodedHtmlNav = he.decode(Buffer.from(contentNav).toString());
  const filePath = path.join(__dirname, '../internal/html/', filename);
  try {
    content = await fs.readFile(filePath);
  } catch (e) {
  }
  const decodedHtml = he.decode(Buffer.from(content).toString());
  finalContent = decodedHtmlNav + decodedHtml
  sections = JSON.parse(await api(blogUrl + "/api/webhook?scope=get_sections"))
  data = {
    blogUrl: blogUrl, product: product, sections: sections
  }
  if (Object.keys(req.query).includes('partial')) {
    res.render('pages/' + key, { data: data });
  } else {
    res.render('index', { page: filename.replace(".html", ""), useEjs: decodedHtml.length == 0, content: finalContent, data: data });
  }

});

/* GET home page. */
router.get('/*', async function (req, res, next) {
  var contentNav = '', content = '', filename = ''
  console.log(req.query)
  console.log(req.params)
  key = req.params[0]
  switch (key) {
    case "home":
      filename = "landing.html"
      break;
    case "":
      filename = "landing.html"
      break;
    default:
      filename = key + ".html"
  }

  const filePathNav = path.join(__dirname, '../internal/html/', 'blog_nav.html');
  try {
    contentNav = await fs.readFile(filePathNav);
  } catch (e) {
  }
  const decodedHtmlNav = he.decode(Buffer.from(contentNav).toString());
  const filePath = path.join(__dirname, '../internal/html/', filename);
  try {
    content = await fs.readFile(filePath);
  } catch (e) {
  }
  const decodedHtml = he.decode(Buffer.from(content).toString());
  finalContent = decodedHtmlNav + decodedHtml
  full_data = JSON.parse(await api(blogUrl + "/api/webhook?scope=get_products"))
  banners = await api(blogUrl + "/api/webhook?scope=get_banners")
  sections = JSON.parse(await api(blogUrl + "/api/webhook?scope=get_sections"))
  // Bottom Banner - Shipping Service
  products = full_data.products
  product = {}

  if (key == "single-product") {
    product = products.filter((v, i) => { return v.id == parseInt(req.query.id) })[0];
  }

  data = {
    product: product,
    sections: sections,
    blogUrl: blogUrl,
    banners: banners,
    products: full_data.products,
    categories: full_data.categories,
    brands: full_data.brands,
  }

  if (Object.keys(req.query).includes('partial')) {
    res.render('pages/' + key, { data: data });
  } else {
    res.render('index', {
      page: filename.replace(".html", ""), useEjs: decodedHtml.length == 0, content: finalContent, data: data
    });
  }

});

module.exports = router;
