const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const { regenerateCsrfToken } = require('../middleware/csrf.middleware');
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  baseCookieOptions,
} = require('../utils/cookies');

// Response shapes below intentionally match the original routes exactly
// (status code, presence/absence of a "status" field, message wording) --
// existing frontend pages branch on some of these literal strings.

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  if (!result.ok) {
    return res.json({ status: 'FAILED', message: result.message });
  }
  regenerateCsrfToken(req, res);
  res.json({ status: 'SUCCESS', message: result.message });
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
    return res.json({ status: 'FAILED', message: result.message });
  }

  res.cookie('access_token', result.accessToken, accessTokenCookieOptions());
  res.cookie('refresh_token', result.refreshToken, refreshTokenCookieOptions(result.refreshMaxAge));
  regenerateCsrfToken(req, res);

  res.json({
    status: 'SUCCESS',
    message: result.message,
    data: result.userData,
  });
});

const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.user.id);

  res.clearCookie('access_token', baseCookieOptions);
  res.clearCookie('refresh_token', baseCookieOptions);
  res.clearCookie('csrf_token', baseCookieOptions);

  res.json({ status: 'SUCCESS', message: 'Logged out successfully' });
});

const verifyOtp = asyncHandler(async (req, res) => {
  const result = await authService.verifyOtp(req.body);
  if (!result.ok) {
    return res.json({ status: 'FAILED', message: result.message });
  }

  res.cookie('access_token', result.accessToken, accessTokenCookieOptions());
  res.cookie('refresh_token', result.refreshToken, refreshTokenCookieOptions(result.refreshMaxAge));
  regenerateCsrfToken(req, res);

  res.json({ status: 'SUCCESS', message: result.message });
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
    return res.status(404).json({ message: result.message });
  }
  regenerateCsrfToken(req, res);
  res.json({ message: result.message });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  if (!result.ok) {
    return res.status(400).json({ message: result.message });
  }
  regenerateCsrfToken(req, res);
  res.json({ message: result.message });
});

const refreshToken = asyncHandler(async (req, res) => {
  const result = await authService.refreshAccessToken(req.cookies.refresh_token);
  if (!result.ok) {
    const statusCode = result.message === 'No refresh token' ? 401 : 403;
    return res.status(statusCode).json({ status: 'FAILED', message: result.message });
  }

  res.cookie('access_token', result.accessToken, accessTokenCookieOptions());
  res.json({ status: 'SUCCESS', message: 'Token refreshed' });
});

const checkAuth = asyncHandler(async (req, res) => {
  const user = await authService.checkAuth(req.user.id);
  res.json({ status: 'SUCCESS', user });
});

const csrfToken = (req, res) => {
  res.json({ csrfToken: res.locals.csrfToken });
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
