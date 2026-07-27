const crypto = require('crypto');
const { isProduction } = require('../config/env');

const CSRF_COOKIE_MAX_AGE = 24 * 60 * 60 * 1000; // 1 day

// Middleware: Verify CSRF token
const csrfProtection = (req, res, next) => {
  const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (!unsafeMethods.includes(req.method)) {
    return next(); // Skip CSRF check for safe methods
  }

  const csrfCookie = req.cookies.csrf_token;
  const csrfHeader = req.headers['x-csrf-token'];

  if (!csrfCookie || !csrfHeader) {
    return res.status(403).json({
      status: 'FAILED',
      message: 'Missing CSRF token',
    });
  }

  const [token, timestamp] = csrfCookie.split('|');

  if (token !== csrfHeader) {
    return res.status(403).json({
      status: 'FAILED',
      message: 'CSRF token mismatch',
    });
  }

  const tokenAge = Date.now() - parseInt(timestamp, 10);

  if (isNaN(tokenAge) || tokenAge > CSRF_COOKIE_MAX_AGE) {
    return res.status(403).json({
      status: 'FAILED',
      message: 'CSRF token has expired',
    });
  }

  next();
};

const csrfCookieOptions = {
  httpOnly: true, // Client never needs to read this directly — the token is delivered via the /csrf-token JSON response instead
  sameSite: 'Strict', // Prevents cross-site submission
  secure: isProduction,
  maxAge: CSRF_COOKIE_MAX_AGE,
};

const buildCsrfCookieValue = () => {
  const token = crypto.randomUUID();
  const timestamp = Date.now();
  return { token, fullToken: `${token}|${timestamp}` };
};

// Middleware: Generate CSRF token and set it in HttpOnly cookie
const generateCsrfToken = (req, res, next) => {
  const { token, fullToken } = buildCsrfCookieValue();
  res.cookie('csrf_token', fullToken, csrfCookieOptions);
  res.locals.csrfToken = token; // Expose token part only for response
  next();
};

// Utility: Regenerate a new token manually if needed
const regenerateCsrfToken = (req, res) => {
  const { fullToken } = buildCsrfCookieValue();
  res.cookie('csrf_token', fullToken, csrfCookieOptions);
};

module.exports = {
  csrfProtection,
  generateCsrfToken,
  regenerateCsrfToken,
};
