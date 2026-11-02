var express = require('express');
var router = express.Router();
const fs = require('fs');
require('dotenv').config();

const db = require('../lib/db');

/* GET webhook / API queries. */
router.get('/', async function (req, res, next) {
  try {
    const scope = req.query.scope;
    switch (scope) {
      case 'get_products': {
        const data = await db.getProducts();
        return res.json(data);
      }
      case 'get_product': {
        const product = await db.getProductById(req.query.id);
        return res.json(product);
      }
      case 'get_sections': {
        const sections = await db.getSections();
        return res.json(sections);
      }
      case 'get_banners': {
        const banners = await db.getBanners();
        return res.json(banners);
      }
      case 'get_contact': {
        const contact = await db.getContact();
        return res.json(contact);
      }
      case 'get_pages': {
        const pages = await db.getPages();
        return res.json(pages);
      }
      default: {
        return res.status(400).json({ error: 'Unknown scope' });
      }
    }
  } catch (error) {
    console.error('Error handling API request:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/* GET blog updates and regenerate HTML pages & nav */
router.get('/blog_updates', async function (req, res, next) {
  var nroute = [], li_route = [];
  try {
    const contact = await db.getContact();
    const pages = await db.getPages();

    pages.forEach((blog) => {
      const htmlContent = blog.content || '';

      if (blog.show_nav) {
        li_route.push(`<li>
          <a href="${blog.route_name}" class="navi">${blog.name}</a>
        </li>`);
      } else {
        li_route.push(`<li class="d-none">
          <a href="${blog.route_name}" class="navi">${blog.name}</a>
        </li>`);
      }

      nroute.push(`{ html: "${blog.route_name.replace('/', '')}.html", title: "${blog.name}", route: "${blog.route_name}" },`);

      fs.writeFileSync(`./views/pages${blog.route_name}.ejs`, htmlContent, 'utf8');
    });

    const new_routes = `
var route_names = [
    { html: "landing.html", title: "Home", route: "/home", },
    { html: "contact.html", title: "Contact", route: "/contact", },
    { html: "single-product.html", title: "Product", route: "/single-product/:id", },
    ${nroute.join('\n    ')}
    { html: "not_found.html", title: "Not Found", route: "/not-found" },
];
`;
    fs.writeFileSync(`./public/js/route.js`, new_routes, 'utf8');

    const whatsappLink = (contact && contact.plain_content2) || 'https://wa.me/60122664254?text=Hello%20there!';
    const contactPhone = (contact && contact.plain_content1) || '';

    const blog_nav_html = `<!-- Header -->
<header class="header chasmishco_header">
    <div class="container">
        <div class="row align-items-center">
            <div class="col-xl-3 col-lg-2 col-4">
                <div class="logo">
                    <a class="navi" href="/home">
                        <img src="/img/logo/logo1.png" alt="chasmishco Logo">
                    </a>
                </div>
            </div>
            <div class="col-xl-9 col-lg-10 col-8 position-relative">
                <div class="header_right_sidebar">
                    <div class="login_account">
                        <div class="account">
                            <ul>
                                <li>
                                    <a href="${whatsappLink}">
                                        <img src="/img/wa150.png" style="width: 24px;"> ${contactPhone}
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>
                    <div class="glass_toggle_menu">
                        <nav class="mainmenu_nav mainmenu__nav">
                            <ul class="main_menu">
                                <li>
                                    <a class="navi" href="/home">Home</a>
                                </li>
                                ${li_route.join('')}
                            </ul>
                        </nav>
                        <div class="hamburger-box button mobile-toggle">
                            <span class="mobile-toggle__icon"></span>
                        </div>
                    </div>
                    <div class="mobile-menu-toggle d-lg-none">
                        <button class="menu-toggle">
                            <span></span>
                            <span></span>
                            <span></span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</header>

<!-- Mobile Menu Start -->
<div class="mobile-menu mobile-menu-items">
    <div class="mobile-menu-close">
        <button class="close-toggle">
            <span></span>
            <span></span>
        </button>
    </div>
    <ul class="main_menu">
        <li>
            <a class="navi" href="/home">Home</a>
        </li>
        ${li_route.join('')}
    </ul>
</div>
<div class="menu-overlay"></div>
<!-- Mobile Menu End -->
<!-- Cart Overlay -->
<div class="body_overlay"></div>
<!--// Header -->`;

    fs.writeFileSync(`./internal/html/blog_nav.html`, blog_nav_html, 'utf8');

    res.json({ status: 'HTML pages created successfully' });
  } catch (error) {
    console.error('Error fetching blog updates:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
