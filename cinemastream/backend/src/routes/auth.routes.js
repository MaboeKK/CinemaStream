const express = require('express');
const router = express.Router();

const authController = require('../controllers/auth.controller');
const verifyToken = require('../middleware/auth.middleware');
const { csrfProtection, generateCsrfToken } = require('../middleware/csrf.middleware');
const authLimiter = require('../middleware/rateLimiter.middleware');
const { validate, schemas } = require('../utils/validation');

router.post(
  '/register',
  authLimiter,
  csrfProtection,
  validate(schemas.register),
  authController.register
);
router.post('/login', authLimiter, csrfProtection, validate(schemas.login), authController.login);
router.post('/logout', verifyToken, authController.logout);
router.post(
  '/verify-otp',
  authLimiter,
  csrfProtection,
  validate(schemas.verifyOtp),
  authController.verifyOtp
);
router.post(
  '/resend-otp',
  authLimiter,
  csrfProtection,
  validate(schemas.resendOtp),
  authController.resendOtp
);
router.post(
  '/forgot-password',
  authLimiter,
  csrfProtection,
  validate(schemas.forgotPassword),
  authController.forgotPassword
);
router.post(
  '/reset-password',
  authLimiter,
  csrfProtection,
  validate(schemas.resetPassword),
  authController.resetPassword
);
router.post('/refresh-token', authController.refreshToken);
router.get('/check-auth', verifyToken, authController.checkAuth);
router.get('/csrf-token', generateCsrfToken, authController.csrfToken);

module.exports = router;
