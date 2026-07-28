const rateLimit = require('express-rate-limit');
const { NODE_ENV } = require('../config/env');

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    status: 'FAILED',
    message: 'Too many requests from this IP, please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Integration tests exercise these routes far more than 5 times per IP
  // within a window; the limiter itself isn't what's under test here.
  skip: () => NODE_ENV === 'test',
});

module.exports = authLimiter;
