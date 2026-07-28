// Thrown for genuinely unexpected failures (DB down, programmer error, etc.) --
// not for expected business outcomes like "wrong password" or "user not found",
// which services return as a normal result object instead so existing
// frontend branches on response.data.message keep working unchanged.
class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.name = 'AppError';
    this.statusCode = statusCode;
  }
}

module.exports = AppError;
