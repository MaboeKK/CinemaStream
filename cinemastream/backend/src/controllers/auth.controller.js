const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const { regenerateCsrfToken } = require('../middleware/csrf.middleware');
const { sendSuccess, sendError } = require('../utils/response');
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  baseCookieOptions,
} = require('../utils/cookies');

// Every handler below (except resendOtp, which stays on the legacy
// { status: 'SUCCESS' | 'FAILED' } shape) follows the same envelope: success
// is { success: true, data, message } via sendSuccess, failure is
// { success: false, error: { code, message } } via sendError, with the HTTP
// status resolved from the failure's `code` (see utils/response.js).

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  if (!result.ok) {
    return sendError(res, result);
  }
  regenerateCsrfToken(req, res);
  sendSuccess(res, { status: 201, message: result.message });
});

const login = asyncHandler(async (req, res) => {
  const { email, password, rememberMe } = req.body;
  const result = await authService.login({
    email,
    password,
    rememberMe,
    ipAddress: req.ip || req.connection.remoteAddress,
    userAgent: req.headers['user-agent'] || 'unknown',
  });

  if (!result.ok) {
    return sendError(res, result);
  }

  res.cookie('access_token', result.accessToken, accessTokenCookieOptions());
  res.cookie('refresh_token', result.refreshToken, refreshTokenCookieOptions(result.refreshMaxAge));
  regenerateCsrfToken(req, res);

  sendSuccess(res, { data: result.userData, message: result.message });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);

  res.clearCookie('access_token', baseCookieOptions);
  res.clearCookie('refresh_token', baseCookieOptions);
  res.clearCookie('csrf_token', baseCookieOptions);

  sendSuccess(res, { message: 'Logged out successfully' });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyOtp(req.body);
  if (!result.ok) {
    return sendError(res, result);
  }

  res.cookie('access_token', result.accessToken, accessTokenCookieOptions());
  res.cookie('refresh_token', result.refreshToken, refreshTokenCookieOptions(result.refreshMaxAge));
  regenerateCsrfToken(req, res);

  sendSuccess(res, { message: result.message });
});

const resendOtp = asyncHandler(async (req, res) => {
  const result = await authService.resendOtp(req.body);
  if (!result.ok) {
    return res.json({ status: 'FAILED', message: result.message });
  }
  res.json({ status: 'SUCCESS', message: result.message });
});

const forgotPassword = asyncHandler(async (req, res) => {
  const result = await authService.forgotPassword(req.body);
  if (!result.ok) {
    return sendError(res, result);
  }
  regenerateCsrfToken(req, res);
  sendSuccess(res, { message: result.message });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  if (!result.ok) {
    return sendError(res, result);
  }
  regenerateCsrfToken(req, res);
  sendSuccess(res, { message: result.message });
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshAccessToken(req.cookies.refresh_token);
  if (!result.ok) {
    return sendError(res, result);
  }

  res.cookie('access_token', result.accessToken, accessTokenCookieOptions());
  sendSuccess(res, { message: 'Token refreshed' });
});

const checkAuth = asyncHandler(async (req, res) => {
  const user = await authService.checkAuth(req.user.id);
  sendSuccess(res, { data: user, message: 'Authenticated' });
});

const csrfToken = (req, res) => {
  sendSuccess(res, { data: { csrfToken: res.locals.csrfToken } });
};

module.exports = {
  register,
  login,
  logout,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  refreshToken,
  checkAuth,
  csrfToken,
};
