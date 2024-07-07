var express = require('express');
var router = express.Router();
const axios = require('axios');
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
router.get('/blog_url', async function (req, res, next) {
    
    res.json(blogUrl);

    // res.send('respond with a resource');
});
module.exports = router;
