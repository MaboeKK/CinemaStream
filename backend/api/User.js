const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { createUser } = require('../models/User');

// Generate 6-digit OTP
const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

// Signup
router.post('/signup', async (req, res) => {
    try {
        let { first_name, last_name, email, password } = req.body;
        first_name = first_name.trim();
        last_name = last_name.trim();
        email = email.trim();
        password = password.trim();

        if (!first_name || !last_name || !email || !password) {
            return res.json({ status: "FAILED", message: "Empty input fields" });
        }

        if (!/^[a-zA-Z ]+$/.test(first_name) || !/^[a-zA-Z ]+$/.test(last_name)) {
            return res.json({ status: "FAILED", message: "Invalid name entered" });
        }

        if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
            return res.json({ status: "FAILED", message: "Invalid email entered" });
        }

        if (password.length < 8) {
            return res.json({ status: "FAILED", message: "Password too short" });
        }

        const userExists = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userExists.rows.length > 0) {
            return res.json({ status: "FAILED", message: "User already exists" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const otp = generateOTP();
        const otpExpiry = new Date(Date.now() + 3 * 60 * 1000); // 3 mins from now

        await createUser(first_name, last_name, email, hashedPassword, otp, otpExpiry);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'isaacjam84@gmail.com',
                pass: 'hchxoxjhiekrqymu' // Gmail app password
            }
        });

        const mailOptions = {
            from: 'isaacjam84@gmail.com',
            to: email,
            subject: 'Your OTP for Email Verification',
            html: `<p>Hi ${first_name},</p>
                   <p>Your OTP is: <b>${otp}</b></p>
                   <p>This OTP will expire in 10 minutes.</p>`
        };

        await transporter.sendMail(mailOptions);

        res.json({
            status: "SUCCESS",
            message: "Signup successful. An OTP has been sent to your email."
        });
    } catch (err) {
        console.error('Signup error:', err);
        res.json({ status: "FAILED", message: "Signup failed due to server error" });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    const { email, otp } = req.body;

    try {
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

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

        await pool.query('UPDATE users SET is_verified = true, verification_token = NULL, otp_expiry = NULL WHERE user_id = $1', [user.user_id]);

        res.json({ status: "SUCCESS", message: "Email verified successfully" });
    } catch (error) {
        console.error('OTP verification error:', error);
        res.json({ status: "FAILED", message: "Verification failed" });
    }
});

// Login
router.post('/login', async (req, res) => {
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
