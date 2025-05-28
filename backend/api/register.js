const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const nodemailer = require('nodemailer');
const { createUser } = require('../models/User');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();

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
        const otpExpiry = new Date(Date.now() + 3 * 60 * 1000);

        await createUser(first_name, last_name, email, hashedPassword, otp, otpExpiry);

        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: 'isaacjam84@gmail.com',
                pass: 'hchxoxjhiekrqymu'
            },
            tls: {
                rejectUnauthorized: false
            }
        });

        const mailOptions = {
            from: "Cinema Stream <isaacjam84@gmail.com>",
            to: email,
            subject: 'Your OTP for Email Verification',
            html: `
                <div style="font-family: Helvetica,Arial,sans-serif;line-height:2">
                    <p>Hi ${first_name},</p>
                    <p>Thank you for choosing Cinema-Stream. Use the following OTP to complete your Sign Up procedures. OTP is valid for 3 minutes</p>
                    <h2 style="background:rgb(106, 0, 0);width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
                    <p>Regards,<br/>Cinema-Stream</p>
                </div>`
        };

        await transporter.sendMail(mailOptions);

        res.json({ status: "SUCCESS", message: "Signup successful. OTP sent." });
    } catch (err) {
        console.error('Signup error:', err);
        res.json({ status: "FAILED", message: "Signup failed due to server error" });
    }
});

module.exports = router;