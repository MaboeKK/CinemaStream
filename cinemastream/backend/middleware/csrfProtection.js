const csrfProtection = (req, res, next) => {
  // Only enforce CSRF protection on state-changing methods
  const unsafeMethods = ['POST', 'PUT', 'PATCH', 'DELETE'];

  if (!unsafeMethods.includes(req.method)) {
    return next(); // Allow safe methods through (GET, HEAD, OPTIONS)
  }

  const csrfCookie = req.cookies.csrf_token;
  const csrfHeader = req.headers['x-csrf-token'];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({
      status: 'FAILED',
      message: 'CSRF token mismatch or missing',
    });
  }

  next();
};

module.exports = csrfProtection;