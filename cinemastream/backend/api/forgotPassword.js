const express = require("express");
const router = express.Router();
const { findUserByEmail, saveResetToken } = require("../models/User");
const nodemailer = require("nodemailer");
const authLimiter = require("../middleware/rateLimiter");

router.post("/forgot-password", authLimiter, async (req, res) => {
  const { email } = req.body;

  try {
    const user = await findUserByEmail(email);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const resetToken = Math.floor(100000 + Math.random() * 900000).toString();

    const expiry = new Date(Date.now() + 10 * 60 * 1000); // 10 mins

    await saveResetToken(email, resetToken, expiry);

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
      tls: { rejectUnauthorized: false },
    });

    await transporter.sendMail({
      from: `"Cinemastream Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Your Password Reset OTP",
      text: `Your password reset OTP is: ${resetToken}. It expires in 10 minutes.`,
    });

    res.json({ message: "Reset OTP sent to your email." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to send reset OTP" });
  }
});

module.exports = router;
