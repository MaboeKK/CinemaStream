const express = require('express');
const router = express.Router();

router.post('/logout', (req, res) => {
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
});

module.exports = router;