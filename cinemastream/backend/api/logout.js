const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const authenticate = require('../middleware/verifyToken'); // Protect route with JWT auth

router.post('/logout', authenticate, async (req, res) => {
  try {
    const userId = req.user.id;

    // Update the latest successful login history for this user (that hasn’t been logged out)
    await pool.query(
      `UPDATE login_history
       SET logout_time = CURRENT_TIMESTAMP
       WHERE user_id = $1 AND was_successful = true AND logout_time IS NULL
       ORDER BY login_time DESC
       LIMIT 1`,
      [userId]
    );

    // Clear tokens & CSRF cookie
    res.clearCookie('access_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    res.clearCookie('refresh_token', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'Strict'
    });

    res.clearCookie('csrf_token', {
      sameSite: 'Strict',
      secure: process.env.NODE_ENV === 'production'
    });

    res.json({ status: 'SUCCESS', message: 'Logged out successfully' });
  } catch (err) {
    console.error('Logout error:', err);
    res.status(500).json({ status: 'FAILED', message: 'Logout failed' });
  }
});

module.exports = router;
