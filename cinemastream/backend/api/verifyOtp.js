const express = require('express');
const router = express.Router();
const pool = require('../config/db');

const jwt = require('jsonwebtoken');
const authLimiter = require('../middleware/rateLimiter');

router.post('/verify-otp', authLimiter, async (req, res) => {
    const { email, otp } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        //const result = await findUserByEmail(email);
        if (result.rows.length === 0) {
            return res.json({ status: "FAILED", message: "User not found" });
        }

        const user = result.rows[0];
        if (user.is_verified) {
            return res.json({ status: "FAILED", message: "User already verified" });
        }

        const currentTime = new Date();
        if (user.verification_token !== otp || currentTime > user.otp_expiry) {
            return res.json({ status: "FAILED", message: "Invalid or expired OTP" });
        }


        // Mark as verified
        await pool.query(
            'UPDATE users SET is_verified = true, verification_token = NULL, otp_expiry = NULL WHERE user_id = $1',
            [user.user_id]
        );

        // Create JWT
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set HttpOnly cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true, // Set to false for localhost testing over HTTP
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000
        });

        // Optional: Send CSRF token here if implementing that
        // const csrfToken = crypto.randomUUID();
        // res.cookie('csrf_token', csrfToken, { sameSite: 'Strict', secure: true });

        res.json({
            status: "SUCCESS",
            message: "Email verified and user logged in"
        });


        res.json({ status: "SUCCESS", message: "Email verified successfully" });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.json({ status: "FAILED", message: "Verification failed" });
    }
});

module.exports = router;
