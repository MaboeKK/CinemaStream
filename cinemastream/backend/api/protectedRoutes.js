const express = require('express');
const router = express.Router();

const verifyToken = require('../middleware/verifyToken');
const checkRole = require('../middleware/checkRole');

// Admin-only route
router.get('/admin-only', verifyToken, checkRole('admin'), (req, res) => {
  res.json({ message: 'Welcome, admin user!' });
});

// Guest-only route
router.get('/guest-content', verifyToken, checkRole('guest'), (req, res) => {
  res.json({ message: 'Welcome, guest user!' });
});

module.exports = router;
