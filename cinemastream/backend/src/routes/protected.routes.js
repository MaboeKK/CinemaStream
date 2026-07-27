const express = require('express');
const router = express.Router();

const protectedController = require('../controllers/protected.controller');
const verifyToken = require('../middleware/auth.middleware');
const checkRole = require('../middleware/role.middleware');

router.get('/admin-only', verifyToken, checkRole('admin'), protectedController.adminOnly);
router.get('/guest-content', verifyToken, checkRole('guest'), protectedController.guestContent);

module.exports = router;
