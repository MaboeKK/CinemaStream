const express = require('express');
const router = express.Router();
const crypto = require('crypto');

router.get('/csrf-token', (req, res) => {
  const token = crypto.randomBytes(24).toString('hex');
  res.cookie('csrf_token', token, {
    httpOnly: false, // must be false so frontend can access it
    secure: false,   // set to true in production with HTTPS
    sameSite: 'Lax'
  });
  res.json({ csrfToken: token });
});

module.exports = router;
