// super_admin is a superset of admin: anywhere requiredRole is 'admin', a
// super_admin passes too. requiredRole 'super_admin' is an exact match,
// reserved for destructive actions (role/status changes, force-logout,
// content-override mutations).
const ADMIN_ROLES = ['admin', 'super_admin'];

const checkRole = (requiredRole) => {
  return (req, res, next) => {
    const userRole = req.user?.role;
    if (!userRole) {
      return res.status(403).json({
        status: 'FAILED',
        message: 'Access denied. No role provided.',
      });
    }

    if (requiredRole === 'guest' && userRole !== 'guest' && !ADMIN_ROLES.includes(userRole)) {
      return res.status(403).json({
        status: 'FAILED',
        message: 'Guests only. Access denied.',
      });
    }

    if (requiredRole === 'admin' && !ADMIN_ROLES.includes(userRole)) {
      return res.status(403).json({
        status: 'FAILED',
        message: 'Admins only. Access denied.',
      });
    }

    if (requiredRole === 'super_admin' && userRole !== 'super_admin') {
      return res.status(403).json({
        status: 'FAILED',
        message: 'Super admins only. Access denied.',
      });
    }

    next();
  };
};

module.exports = checkRole;
