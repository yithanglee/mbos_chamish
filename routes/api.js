var express = require('express');
var router = express.Router();
const axios = require('axios');
const fs = require('fs');
require('dotenv').config();
const blogUrl = process.env.BLOG_URL;
/* GET users listing. */
router.get('/', async function (req, res, next) {

    try {
        const apiUrl = blogUrl + "/api/webhook" + req.url; // Replace with the actual API URL
        const response = await axios.get(apiUrl);
        console.log(response.data)
        // You can handle the response data here and send it back to the client
        res.json(response.data);
    } catch (error) {
        console.error('Error calling external API:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }


    // res.send('respond with a resource');
});

/* GET blog updates and create HTML pages */
router.get('/blog_updates', async function (req, res, next) {
    var nroute = [], li_route = []
    try {
        console.log(blogUrl)


        const apiUrl0 = blogUrl + "/api/webhook?scope=get_contact"; // Adjust the API URL as needed
        const response0 = await axios.get(apiUrl0);

        const apiUrl = blogUrl + "/api/webhook?scope=get_pages"; // Adjust the API URL as needed
        const response = await axios.get(apiUrl);
        const data = response.data;

        console.log(data)

        // Assuming data contains an array of blog updates
        data.forEach((blog, index) => {
            const htmlContent = blog.content;


            if (blog.show_nav) {
                li_route.push(`<li>
                <a href="`+ blog.route_name + `" class="navi">` + blog.name + `</a>
            </li>`)
            } else {
                li_route.push(`<li class="d-none">
                <a href="`+ blog.route_name + `" class="navi">` + blog.name + `</a>
            </li>`)
            }


            // Write the HTML content to a file
          
            nroute.push(`{ html: "` + blog.route_name.replace("/", "") + `.html", title: "` + blog.name + `", route: "` + blog.route_name + `" },`)

            fs.writeFileSync(`./views/pages${blog.route_name}.ejs`, htmlContent, 'utf8');
        });


        var new_routes = `
        var route_names = [
            { html: "landing.html", title: "Home", route: "/home", },
            { html: "contact.html", title: "Contact", route: "/contact", },
            { html: "single-product.html", title: "Product", route: "/single-product/:id", },
            `+ nroute.join("") + `
            { html: "not_found.html", title: "Not Found", route: "/not-found" },
        ]
        
        
        `
        fs.writeFileSync(`./public/js/route.js`, new_routes, 'utf8');
        var blog_nav_html = `<!-- Header -->
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
                                            <a href="` + (response0.data.plain_content2 || 'https://wa.me/60122664254?text=Hello%20there!') + `">
                                                <img src="/img/wa150.png" style="width: 24px;">`+ response0.data.plain_content1 + `
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
                                        `+ li_route.join("") + `
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
                `+ li_route.join("") + `
            </ul>
        </div>
        <div class="menu-overlay"></div>
        <!-- Mobile Menu End -->
        <!-- Cart Overlay -->
        <div class="body_overlay"></div>
        <!--// Header -->`

        fs.writeFileSync(`./internal/html/blog_nav.html`, blog_nav_html, 'utf8');

        res.json({ status: "HTML pages created successfully" });
    } catch (error) {
        console.error('Error fetching blog updates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
