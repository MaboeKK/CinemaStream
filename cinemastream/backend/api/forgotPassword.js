const express = require("express");
const router = express.Router();
const { findUserByEmail, saveResetToken } = require("../models/User");
const { sendHTMLEmail } = require("../services/emailService");
const authLimiter = require('../middleware/rateLimiter');

//new
const { csrfProtection, regenerateCsrfToken } = require('../middleware/csrfProtection');

router.post("/forgot-password", authLimiter, csrfProtection, async (req, res) => {
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
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; color: #333; line-height: 1.6;">   
        <!-- Styled Logo -->
        <div style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">
          <span style="color: #e50914;">Cinema</span>Stream
        </div>
        <p style="font-size: 16px;">
          You recently requested to reset your password for your <strong>CinemaStream</strong> account.
        </p>
        <p style="font-size: 16px;">
          Please use the following One-Time Password (OTP) to proceed:
        </p>
        <p style="text-align: center; margin: 30px 0;">
          <span style="display: inline-block; background-color: #6a0000; color: #ffffff; font-size: 24px; padding: 10px 20px; border-radius: 6px; font-weight: bold;">
            ${resetToken}
          </span>
        </p>
        <p style="font-size: 14px; color: #666;">
          This OTP is valid for <strong>3 minutes</strong>. If you did not request a password reset, please ignore this message.
        </p>
        <p style="font-size: 16px;">
          Regards,<br/>
          <strong>The CinemaStream Team</strong>
        </p>
      </div>
    `);
    

      //new
    regenerateCsrfToken(req, res);

    res.json({ message: "Reset OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
});

module.exports = router;