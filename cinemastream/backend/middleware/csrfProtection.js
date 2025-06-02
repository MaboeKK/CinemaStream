const csrfProtection = (req, res, next) => {
  const csrfCookie = req.cookies.csrf_token;
  const csrfHeader = req.headers['x-csrf-token'];

  if (!csrfCookie || !csrfHeader || csrfCookie !== csrfHeader) {
    return res.status(403).json({ status: 'FAILED', message: 'CSRF token mismatch or missing' });
  }

  next();
};

module.exports = csrfProtection;
