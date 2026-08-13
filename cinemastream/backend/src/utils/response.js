// Single source of truth for the API's response envelope: every
// controller/middleware emits { success: true, data, message } on success
// and { success: false, error: { code, message } } on failure, via
// sendSuccess/sendError below. The HTTP status for a given failure code is
// resolved here too, so call sites pass a stable code instead of each
// duplicating the code -> status mapping (or, worse, branching on message
// text).
const ERROR_STATUS_BY_CODE = {
  USER_NOT_FOUND: 404,
  EMAIL_ALREADY_EXISTS: 409,
  INVALID_CREDENTIALS: 401,
  EMAIL_NOT_VERIFIED: 401,
  ALREADY_VERIFIED: 409,
  INVALID_OTP: 400,
  INVALID_RESET_TOKEN: 400,
  RESET_TOKEN_EXPIRED: 400,
  NO_REFRESH_TOKEN: 401,
  INVALID_REFRESH_TOKEN: 403,
  UNAUTHORIZED: 401,
  INVALID_TOKEN: 403,
  FORBIDDEN: 403,
  CSRF_ERROR: 403,
  RATE_LIMITED: 429,
};

const sendSuccess = (res, { status = 200, data = null, message } = {}) =>
  res.status(status).json({ success: true, data, message });

const sendError = (res, { code, message, status } = {}) =>
  res.status(status || ERROR_STATUS_BY_CODE[code] || 400).json({
    success: false,
    error: { code: code || 'BAD_REQUEST', message },
  });

module.exports = { sendSuccess, sendError, ERROR_STATUS_BY_CODE };
