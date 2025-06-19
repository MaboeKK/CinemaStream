const express = require('express');
const jwt = require('jsonwebtoken');
const router = express.Router();

router.post('/refresh-token', (req, res) => {
  const token = req.cookies.refresh_token;
  if (!token) return res.status(401).json({ status: 'FAILED', message: 'No refresh token' });

  try {
    const payload = jwt.verify(token, process.env.REFRESH_SECRET);

   const newAccessToken = jwt.sign(
  { id: payload.userId, role: payload.role },
  process.env.JWT_SECRET,
  { expiresIn: '15m' }
);


    res.cookie('access_token', newAccessToken, {
      httpOnly: true,
      sameSite: 'strict',
      secure: process.env.NODE_ENV === 'production',
      maxAge: 15 * 60 * 1000
    });

    res.json({ status: 'SUCCESS', message: 'Token refreshed' });
  } catch (err) {
    res.status(403).json({ status: 'FAILED', message: 'Invalid refresh token' });
  }
});

module.exports = router;