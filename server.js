require('dotenv').config();
const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const rateLimit = require('express-rate-limit');
const xss = require('xss-clean');
const sanitizeHtml = require('sanitize-html');
const cookieParser = require('cookie-parser');
const config = require('./config');
const logger = require('./utils/logger');
const db = require('./utils/db'); // Assuming db connection is set up

const app = express();

// Security headers
app.use(helmet());

// Enable CORS if configured
if (config.get('enableCors')) {
  app.use(cors({ origin: true, credentials: true }));
}

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Input sanitization if enabled
if (config.get('enableSanitization')) {
  app.use((req, res, next) => {
    // Sanitize body
    if (req.body) {
      for (let key in req.body) {
        if (typeof req.body[key] === 'string') {
          req.body[key] = sanitizeHtml(req.body[key]);
        }
      }
    }
    // Sanitize query
    if (req.query) {
      for (let key in req.query) {
        if (typeof req.query[key] === 'string') {
          req.query[key] = sanitizeHtml(req.query[key]);
        }
      }
    }
    // Sanitize params
    if (req.params) {
      for (let key in req.params) {
        if (typeof req.params[key] === 'string') {
          req.params[key] = sanitizeHtml(req.params[key]);
        }
      }
    }
    next();
  });
}

// Rate limiting if enabled
if (config.get('enableRateLimiting')) {
  const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: config.get('rateLimit')
  });
  app.use(limiter);
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK' });
});

// Routes
// app.use('/api', require('./routes'));

// Error handling
app.use((err, req, res, next) => {
  logger.error(err.stack);
  res.status(500).json({ message: 'Internal Server Error' });
});

const port = config.get('port');
app.listen(port, async () => {
  logger.info(`Server running on port ${port}`);
  logger.info(`http://localhost:${port}/health`);
  await db.connect(); // Connect to database
});

module.exports = app;