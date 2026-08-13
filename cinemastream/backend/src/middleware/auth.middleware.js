const tokenService = require('../services/token.service');
const { sendError } = require('../utils/response');

const verifyToken = (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return sendError(res, { code: 'UNAUTHORIZED', message: 'Access denied. No token provided.' });
  }

  try {
    const decoded = tokenService.verifyAccessToken(token);
    req.user = decoded; // attach user info to request
    next();
  } catch {
    return sendError(res, { code: 'INVALID_TOKEN', message: 'Invalid or expired token.' });
  }
};

module.exports = verifyToken;
