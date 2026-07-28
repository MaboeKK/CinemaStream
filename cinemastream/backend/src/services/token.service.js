const jwt = require('jsonwebtoken');
const { JWT_SECRET, REFRESH_SECRET } = require('../config/env');

const ACCESS_TOKEN_TTL = '15m';
const REFRESH_TOKEN_TTL = '7d';

const signAccessToken = (user) =>
  jwt.sign({ id: user.user_id, role: user.role }, JWT_SECRET, { expiresIn: ACCESS_TOKEN_TTL });

const signRefreshToken = (user) =>
  jwt.sign({ userId: user.user_id, role: user.role }, REFRESH_SECRET, {
    expiresIn: REFRESH_TOKEN_TTL,
  });

const verifyAccessToken = (token) => jwt.verify(token, JWT_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, REFRESH_SECRET);

module.exports = {
  signAccessToken,
  signRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
};
