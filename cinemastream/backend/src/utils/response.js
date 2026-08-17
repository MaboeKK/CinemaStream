// Shared response envelope for the admin-portal endpoints added in this
// branch, matching the { success, data, message } / { success:false,
// error:{code,message} } shape auth.controller.js's newer endpoints already
// use. Deliberately not touching adminUsers/adminStats' existing bare
// res.json(...) calls or any other pre-existing endpoint here -- that
// unification is already in progress on api/unify-response-envelope and
// this avoids colliding with it.
const ERROR_STATUS_BY_CODE = {
  VALIDATION_ERROR: 400,
  NOT_FOUND: 404,
  CONFLICT: 409,
  FORBIDDEN: 403,
  BAD_REQUEST: 400,
};

const sendSuccess = (res, { status = 200, data = null, message } = {}) =>
  res.status(status).json({ success: true, data, message });

const sendError = (res, { code, message, status } = {}) =>
  res.status(status || ERROR_STATUS_BY_CODE[code] || 400).json({
    success: false,
    error: { code: code || 'BAD_REQUEST', message },
  });

module.exports = { sendSuccess, sendError, ERROR_STATUS_BY_CODE };
