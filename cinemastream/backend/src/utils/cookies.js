const { isProduction } = require('../config/env');

const ACCESS_TOKEN_MAX_AGE = 15 * 60 * 1000; // 15 minutes
const REFRESH_TOKEN_MAX_AGE = 7 * 24 * 60 * 60 * 1000; // 7 days
const REFRESH_TOKEN_MAX_AGE_SHORT = 60 * 60 * 1000; // 1 hour (no "remember me")

const baseCookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'Strict',
};

const accessTokenCookieOptions = (maxAge = ACCESS_TOKEN_MAX_AGE) => ({
  ...baseCookieOptions,
  maxAge,
});

const refreshTokenCookieOptions = (maxAge = REFRESH_TOKEN_MAX_AGE) => ({
  ...baseCookieOptions,
  maxAge,
});

module.exports = {
  baseCookieOptions,
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  ACCESS_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE,
  REFRESH_TOKEN_MAX_AGE_SHORT,
};
