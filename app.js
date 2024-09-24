const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // Environment variable 
    pass: process.env.EMAIL_PASS, // Environment variable
  },
});

const axios = require('axios'); // Axios for HTTP requests (to verify CAPTCHA)

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const helmet = require("helmet");

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');
var usersRouter = require('./routes/users');
const fs = require('fs');

// Source directory; this should already exist
const srcDir = path.join(__dirname, 'internal/html');
console.log(srcDir)
// Destination directory; this is where you want to create the symlink
const destDir = path.join(__dirname, 'public/html/v2');


// Function to create the symlink
function createSymlink() {
  fs.symlink(srcDir, destDir, 'dir', (err) => {
    if (err) {
      console.error('Error creating symlink:', err);
    } else {
      console.log('Symlink created successfully');
    }
  });
}

// Check if the symlink already exists
fs.access(destDir, fs.constants.F_OK, (err) => {
  if (!err) {
    // Symlink exists, delete it first
    fs.unlink(destDir, (unlinkErr) => {
      if (unlinkErr) {
        console.error('Error deleting symlink:', unlinkErr);
      } else {
        console.log('Symlink deleted successfully');
        createSymlink();
      }
    });
  } else {
    // Symlink does not exist, create it directly
    createSymlink();
  }
});
var app = express();


// Add helmet to the middleware chain.
// Set CSP headers to allow our Bootstrap and Jquery to be served
app.use(
  helmet.contentSecurityPolicy({
    directives: {
      "form-action": ['localhost:5101/send-inquiry', 'mbos.com.my/send-inquiry', 'mbos.damienslab.com/send-inquiry'],
      defaultSrc: ["'self'", "www.google.com"],
      "script-src-attr": ["'self'", "'unsafe-inline'"],
      "frame-src": ["'self'", "www.google.com", "challenges.cloudflare.com"],
      scriptSrc: ["'self'", "'unsafe-eval'", "'unsafe-inline'", 'openstreetmap.org', 'static.cloudflareinsights.com', 'challenges.cloudflare.com'],
      imgSrc: ["'self'", "localhost:4000", "localhost:5101", "blog.damienslab.com", 'tile.openstreetmap.org', '*.tile.openstreetmap.org'],

    },
  }),
);

// Set up rate limiter: maximum of twenty requests per minute
const RateLimit = require("express-rate-limit");
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 5 minute
  max: 100,
});
// Apply rate limiter to all requests
app.use(limiter);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
// Middleware to extract subdomain
app.use((req, res, next) => {
  const host = req.headers.host;
  // Split the host by '.' and assume the first part is the subdomain
  const subdomain = host.split('.')[0];

  // Optional: Ignore 'www' as a subdomain
  if (subdomain === 'www') {
    req.subdomain = null;  // or you could reassign it to something else
  } else {
    req.subdomain = subdomain;
  }

  next();
});
app.use('/api/webhook', apiRouter);
app.use('/', indexRouter);


app.post('/send-inquiry', async (req, res) => {
  const { name, company, phone, address, email, comment, 'cf-turnstile-response': turnstileToken } = req.body;

  if (!turnstileToken) {
    return res.status(400).json({ error: 'CAPTCHA token verification failed' });
  }

  try {
    const turnstileSecret = process.env.TURNSTILE_SECRET_KEY; // Using environment variable for security
    console.log(turnstileSecret)
    const verifyUrl = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
    if (!turnstileSecret) {
      return res.status(400).json({ error: 'CAPTCHA Missing token' });
    }
    const captchaVerification = await axios.post(verifyUrl, null, {
      params: {
        secret: turnstileSecret,
        response: turnstileToken,
      },
      timeout: 5000, // Add a timeout to avoid hanging
    });

    console.log(captchaVerification)

    if (!captchaVerification.data.success) {
      return res.status(400).json({ error: 'CAPTCHA verification failed' });
    }

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: 'sales@mbos.com.my',
      subject: 'New Inquiry from Website',
      text: `
        Name: ${name}
        Company: ${company}
        Phone: ${phone}
        Address: ${address}
        Email: ${email}
        Comment: ${comment}
      `,
    };

    await transporter.sendMail(mailOptions);

    // res.status(200).json({ message: 'Inquiry sent successfully!' });
    res.redirect('/home');
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
