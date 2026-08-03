// Centralized error handler -- must be registered last, after all routes.
// Anything reaching here is an unexpected failure (asyncHandler forwards
// rejected promises here); expected business outcomes ("wrong password",
// "user not found", etc.) are returned by services/controllers directly
// and never reach this middleware.
// eslint-disable-next-line no-unused-vars -- Express identifies error middleware by its 4-arg arity
const errorHandler = (err, req, res, next) => {
  const isProduction = process.env.NODE_ENV === 'production';

  console.error(err);

  res.status(500).json({
    status: 'FAILED',
    message: isProduction ? 'An unexpected error occurred' : err.message || 'An unexpected error occurred',
  });
};

module.exports = errorHandler;
