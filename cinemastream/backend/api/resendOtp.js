const express = require('express');
const router = express.Router();
const { updateOtpInDb, findUserByEmail, sendOtpToUser } = require('../models/User');
const { csrfProtection } = require('../middleware/csrfProtection');
const rateLimiter = require('../middleware/rateLimiter');

router.post('/resend-otp', rateLimiter, csrfProtection, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) {
      return res.json({ status: "FAILED", message: "User not found" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 mins from now

    await updateOtpInDb(user.user_id, otp, expiry);
    await sendOtpToUser(email, otp); // send email or SMS

    return res.json({ status: "SUCCESS", message: "OTP resent successfully" });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ status: "FAILED", message: "Could not resend OTP" });
  }
});

module.exports = router;
