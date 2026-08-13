const asyncHandler = require('../utils/asyncHandler');
const authService = require('../services/auth.service');
const { regenerateCsrfToken } = require('../middleware/csrf.middleware');
const {
  accessTokenCookieOptions,
  refreshTokenCookieOptions,
  baseCookieOptions,
} = require('../utils/cookies');

// register, login, forgotPassword, resetPassword and verifyOtp follow
// standard REST semantics: success is { success: true, data, message } with
// a 2xx status, failure is { success: false, error: { code, message } } with
// the status the failure actually represents. auth.service maps each
// business outcome to a `code` (see ERROR_STATUS_BY_CODE below) instead of
// callers matching on message text.
//
// logout/resendOtp/refreshToken/checkAuth are unchanged (out of scope for
// this pass) and keep their original { status: 'SUCCESS' | 'FAILED' } shape.

const ERROR_STATUS_BY_CODE = {
  USER_NOT_FOUND: 404,
  EMAIL_ALREADY_EXISTS: 409,
  INVALID_CREDENTIALS: 401,
  EMAIL_NOT_VERIFIED: 401,
  ALREADY_VERIFIED: 409,
  INVALID_OTP: 400,
  INVALID_RESET_TOKEN: 400,
  RESET_TOKEN_EXPIRED: 400,
};

const sendError = (res, result) => {
  const status = ERROR_STATUS_BY_CODE[result.code] || 400;
  return res.status(status).json({
    success: false,
    error: { code: result.code || 'BAD_REQUEST', message: result.message },
  });
};

const register = asyncHandler(async (req, res) => {
  const result = await authService.register(req.body);
  if (!result.ok) {
    return sendError(res, result);
  }
  regenerateCsrfToken(req, res);
  res.status(201).json({ success: true, data: null, message: result.message });
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

  res.json({
    success: true,
    data: result.userData,
    message: result.message,
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
    return sendError(res, result);
  }

  res.cookie('access_token', result.accessToken, accessTokenCookieOptions());
  res.cookie('refresh_token', result.refreshToken, refreshTokenCookieOptions(result.refreshMaxAge));
  regenerateCsrfToken(req, res);

  res.json({ success: true, data: null, message: result.message });
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
  res.json({ success: true, data: null, message: result.message });
});

const resetPassword = asyncHandler(async (req, res) => {
  const result = await authService.resetPassword(req.body);
  if (!result.ok) {
    return sendError(res, result);
  }
  regenerateCsrfToken(req, res);
  res.json({ success: true, data: null, message: result.message });
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
