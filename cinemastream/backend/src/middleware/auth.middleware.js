const tokenService = require('../services/token.service');

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ status: 'FAILED', message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = tokenService.verifyAccessToken(token);
    req.user = decoded; // attach user info to request
    next();
  } catch {
    return res.status(403).json({ status: 'FAILED', message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
