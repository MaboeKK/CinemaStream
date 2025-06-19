const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const authLimiter = require('../middleware/rateLimiter');
const { findUserByEmail, markUserAsVerified } = require('../models/User');
const { csrfProtection, regenerateCsrfToken } = require('../middleware/csrfProtection');

router.post('/verify-otp', authLimiter, csrfProtection, async (req, res) => {
    const { email, otp } = req.body;

    try {
        const user = await findUserByEmail(email);
        if (!user) {
            return res.json({ status: "FAILED", message: "User not found" });
        }

        if (user.is_verified) {
            return res.json({ status: "FAILED", message: "User already verified" });
        }

        const currentTime = new Date();
        if (user.verification_token !== otp || currentTime > user.otp_expiry) {
            return res.json({ status: "FAILED", message: "Invalid or expired OTP" });
        }

        await markUserAsVerified(user.user_id);

        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        //new
    regenerateCsrfToken(req, res);

        return res.json({
            status: "SUCCESS",
            message: "Email verified and user logged in"
        });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.json({ status: "FAILED", message: "Verification failed" });
    }
});

module.exports = router;