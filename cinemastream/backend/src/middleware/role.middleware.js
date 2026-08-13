const { sendError } = require('../utils/response');

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return sendError(res, { code: 'FORBIDDEN', message: 'Access denied. No role provided.' });
    }

    if (requiredRole === 'guest' && userRole !== 'guest' && userRole !== 'admin') {
      return sendError(res, { code: 'FORBIDDEN', message: 'Guests only. Access denied.' });
    }

    if (requiredRole === 'admin' && userRole !== 'admin') {
      return sendError(res, { code: 'FORBIDDEN', message: 'Admins only. Access denied.' });
    }

    next();
  };
};

module.exports = checkRole;
