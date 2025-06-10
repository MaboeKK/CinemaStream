const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const {
  getUserByEmailAndResetToken,
  updateUserPassword,
  clearResetToken,
} = require("../models/User");
const authLimiter = require("../middleware/rateLimiter");

router.post("/reset-password",csrfProtection, authLimiter, async (req, res) => {
  const { email, resetToken, newPassword } = req.body;

  try {
    const user = await getUserByEmailAndResetToken(email, resetToken);
    if (!user) return res.status(400).json({ message: "Invalid reset token" });
    

    if (new Date() > user.reset_token_expiry) {
      return res.status(400).json({ message: "Reset token expired" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await updateUserPassword(email, hashedPassword);
    await clearResetToken(email);

    res.json({ message: "Password reset successful." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to reset password" });
  }
});

module.exports = router;
