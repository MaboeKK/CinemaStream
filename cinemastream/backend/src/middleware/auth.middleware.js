const tokenService = require('../services/token.service');
const userRepository = require('../repositories/user.repository');
const asyncHandler = require('../utils/asyncHandler');

// A re-check against the DB on every request -- deliberate tradeoff over a
// cache layer, consistent with how the rest of this app favors simplicity
// (see project notes on TMDB client-side, localStorage personalization).
// Without it, suspending/banning a user or forcing a logout would only take
// effect once their existing access token naturally expires (up to 15m),
// since JWTs are otherwise stateless here.
const verifyToken = asyncHandler(async (req, res, next) => {
  const token = req.cookies.access_token;

  if (!token) {
    return res.status(401).json({ status: 'FAILED', message: 'Access denied. No token provided.' });
  }

  let decoded;
  try {
    decoded = tokenService.verifyAccessToken(token);
  } catch {
    return res.status(403).json({ status: 'FAILED', message: 'Invalid or expired token.' });
  }

  const authState = await userRepository.getAuthState(decoded.id);
  if (!authState || authState.status !== 'active' || authState.token_version !== decoded.tv) {
    return res.status(401).json({ status: 'FAILED', message: 'Session no longer valid.' });
  }

  // role/email from the fresh DB read, not the (possibly stale) token claims
  req.user = { ...decoded, role: authState.role, email: authState.email };
  next();
});

module.exports = verifyToken;
