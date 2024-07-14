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
    var nroute = []
    try {
        console.log(blogUrl)
        const apiUrl = blogUrl + "/api/webhook?scope=get_pages"; // Adjust the API URL as needed
        const response = await axios.get(apiUrl);
        const data = response.data;

        console.log(data)

        // Assuming data contains an array of blog updates
        data.forEach((blog, index) => {
            const htmlContent = blog.content;

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

        res.json({ status: "HTML pages created successfully" });
    } catch (error) {
        console.error('Error fetching blog updates:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});
module.exports = router;
