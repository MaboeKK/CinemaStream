const crypto = require('crypto');

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
  const maxTokenAge = 24 * 60 * 60 * 1000; // 24 hours

  if (isNaN(tokenAge) || tokenAge > maxTokenAge) {
    return res.status(403).json({
      status: 'FAILED',
      message: 'CSRF token has expired',
    });
  }

  next();
};

// Middleware: Generate CSRF token and set it in HttpOnly cookie
const generateCsrfToken = (req, res, next) => {
  const token = crypto.randomUUID();
  const timestamp = Date.now();
  const fullToken = `${token}|${timestamp}`;

  res.cookie('csrf_token', fullToken, {
    httpOnly: false, // 🔐 Makes it inaccessible via JS
    sameSite: 'Strict', // Prevents cross-site submission
    secure: process.env.NODE_ENV === 'production', // Only secure in production
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });

  res.locals.csrfToken = token; // Expose token part only for response
  next();
};

// Utility: Regenerate a new token manually if needed
const regenerateCsrfToken = (req, res) => {
  const newToken = generateCsrfTokenForRegeneration();
  res.cookie('csrf_token', newToken, {
    httpOnly: false,
    sameSite: 'Strict',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const generateCsrfTokenForRegeneration = () => {
  const token = crypto.randomUUID();
  const timestamp = Date.now();
  return `${token}|${timestamp}`;
};

module.exports = {
  csrfProtection,
  generateCsrfToken,
  regenerateCsrfToken,
};
