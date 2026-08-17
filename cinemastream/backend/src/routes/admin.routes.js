const express = require('express');
const router = express.Router();

const adminUsersController = require('../controllers/adminUsers.controller');
const adminStatsController = require('../controllers/adminStats.controller');
const adminAuditController = require('../controllers/adminAudit.controller');
const adminContentController = require('../controllers/adminContent.controller');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');
const { csrfProtection } = require('../middleware/csrf.middleware');
const { adminMutationLimiter } = require('../middleware/rateLimiter.middleware');
const { validate, schemas } = require('../utils/validation');

// Auth + "at least admin" apply to every route below; individual mutating
// routes layer on csrfProtection + adminMutationLimiter + validation, and
// upgrade to checkRole('super_admin') where the action is destructive.
router.use(verifyToken, checkRole('admin'));

router.get('/users', adminUsersController.listUsers);
router.get('/users/:id', adminUsersController.getUserDetail);
router.patch(
  '/users/:id/role',
  checkRole('super_admin'),
  csrfProtection,
  adminMutationLimiter,
  validate(schemas.changeRole),
  adminUsersController.changeRole
);
router.patch(
  '/users/:id/status',
  checkRole('super_admin'),
  csrfProtection,
  adminMutationLimiter,
  validate(schemas.changeStatus),
  adminUsersController.changeStatus
);
router.post(
  '/users/:id/force-logout',
  checkRole('super_admin'),
  csrfProtection,
  adminMutationLimiter,
  adminUsersController.forceLogout
);
router.post(
  '/users/:id/verify-email',
  csrfProtection,
  adminMutationLimiter,
  adminUsersController.verifyEmail
);
router.post(
  '/users/:id/trigger-password-reset',
  csrfProtection,
  adminMutationLimiter,
  adminUsersController.triggerPasswordReset
);

router.get('/audit-log', adminAuditController.listAuditLog);

router.get('/content', adminContentController.listOverrides);
router.post(
  '/content',
  checkRole('super_admin'),
  csrfProtection,
  adminMutationLimiter,
  validate(schemas.contentOverride),
  adminContentController.upsertOverride
);
router.delete(
  '/content/:id',
  checkRole('super_admin'),
  csrfProtection,
  adminMutationLimiter,
  adminContentController.removeOverride
);

router.get('/stats/top-shows', adminStatsController.topShows);
router.get('/stats/monthly-growth', adminStatsController.monthlyGrowth);
router.get('/stats/heatmap', adminStatsController.heatmap);
router.get('/stats/overview', adminStatsController.overview);
router.get('/stats/funnel', adminStatsController.funnel);
router.get('/stats/retention', adminStatsController.retention);
router.get('/stats/session-length', adminStatsController.sessionLength);

module.exports = router;
