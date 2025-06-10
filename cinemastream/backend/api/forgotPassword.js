const express = require("express");
const router = express.Router();
const { findUserByEmail, saveResetToken } = require("../models/User");
const { sendHTMLEmail } = require("../services/emailService");
const authLimiter = require('../middleware/rateLimiter');

router.post("/forgot-password",csrfProtection, authLimiter, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();
    const expiry = new Date(Date.now() + 3 * 60 * 1000); // 3 mins
    await saveResetToken(email, resetToken, expiry);

    //Send Email To User
    await sendHTMLEmail(email, 'Your Password Reset OTP', `
      <div style="font-family: Helvetica,Arial,sans-serif;line-height:2">
        <p>Your password reset OTP is: </p>
        <h2 style="background:rgb(106, 0, 0);width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${resetToken}</h2>
        <p>OTP is valid for 3 minutes</p>
        <p>Regards,<br/>Cinema-Stream</p>
      </div>`);

    res.json({ message: "Reset OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
});

module.exports = router;
