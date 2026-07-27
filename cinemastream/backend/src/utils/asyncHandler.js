// Wraps an async Express handler so a rejected promise is forwarded to
// next(err) instead of crashing the process / hanging the request.
const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};

module.exports = asyncHandler;
