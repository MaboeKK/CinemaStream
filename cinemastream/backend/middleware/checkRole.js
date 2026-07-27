const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return res.status(403).json({
        status: "FAILED",
        message: "Access denied. No role provided."
      });
    }

    if (requiredRole === 'guest' && userRole !== 'guest' && userRole !== 'admin') {
      return res.status(403).json({
        status: "FAILED",
        message: "Guests only. Access denied."
      });
    }

    if (requiredRole === 'admin' && userRole !== 'admin') {
      return res.status(403).json({
        status: "FAILED",
        message: "Admins only. Access denied."
      });
    }

    next();
  };
};

module.exports = checkRole;