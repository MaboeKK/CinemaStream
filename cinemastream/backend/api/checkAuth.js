const express = require('express');
const router = express.Router();
const verifyToken = require('../middleware/verifyToken');
const csrfProtection = require('../middleware/csrfProtection');
const pool = require('../config/db');

router.get('/check-auth', verifyToken, csrfProtection, async (req, res) => {
  try {
    const userId = req.user.id;
    const result = await pool.query('SELECT first_name, last_name, email FROM users WHERE id = $1', [userId]);
    const user = result.rows[0];

    res.json({ status: 'SUCCESS', user });
  } catch (err) {
    console.error('Auth check error:', err);
    res.status(500).json({ status: 'FAILED', message: 'Could not verify authentication' });
  }
});

module.exports = router;
