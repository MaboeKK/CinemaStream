const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const jwt = require('jsonwebtoken');
const authLimiter = require('../middleware/rateLimiter');

router.post('/login', authLimiter, async (req, res) => {
    try {
        let { email, password } = req.body;
        email = email.trim();
        password = password.trim();

        if (!email || !password) {
            return res.json({ status: "FAILED", message: "Empty input fields" });
        }

        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (result.rows.length === 0) {
            return res.json({ status: "FAILED", message: "User not found" });
        }

        const user = result.rows[0];
        if (!user.is_verified) {
            return res.json({ status: "FAILED", message: "Please verify your email to login" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ status: "FAILED", message: "Incorrect password" });
        }


        // Sign JWT (you need to have process.env.JWT_SECRET)
        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: '1d' });

        // Set token in HttpOnly cookie
        res.cookie('access_token', token, {
            httpOnly: true,
            secure: true, // make sure your app is on HTTPS in production
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day
        });

        // OPTIONAL: Generate CSRF token here if implementing double-submit protection
        // const csrfToken = crypto.randomUUID();
        // res.cookie('csrf_token', csrfToken, { sameSite: 'Strict', secure: true });

        // Send response
        res.json({
            status: "SUCCESS",
            message: "Login successful",
            data: {
                first_name: user.first_name,
                last_name: user.last_name,
                email: user.email
            }
        });


    
    } catch (error) {
        console.error('Login error:', error);
        res.json({ status: "FAILED", message: "An error occurred during login" });
    }
});

module.exports = router;


