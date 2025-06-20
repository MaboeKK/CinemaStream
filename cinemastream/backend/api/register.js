const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const { sendHTMLEmail } = require("../services/emailService");
const { createUser } = require('../models/User');
const authLimiter = require('../middleware/rateLimiter');
const { csrfProtection, regenerateCsrfToken } = require('../middleware/csrfProtection');

const generateOTP = () => Math.floor(100000 + Math.random() * 900000).toString();


router.post('/register', authLimiter, csrfProtection, async (req, res) => {
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

        //Send Email To User
        await sendHTMLEmail(email, 'Your OTP for Email Verification', `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background-color: #ffffff; color: #333; line-height: 1.6;">
              
              <!-- Styled Logo -->
              <div style="font-size: 24px; font-weight: bold; margin-bottom: 20px;">
                <span style="color: #e50914;">Cinema</span>Stream
              </div>
              <p style="font-size: 16px;">Hi ${first_name},</p>
              <p style="font-size: 16px;">
                Thank you for choosing <strong>CinemaStream</strong>! Please use the following OTP to complete your sign-up:
              </p>   
              <p style="text-align: center; margin: 30px 0;">
                <span style="display: inline-block; background-color: #6a0000; color: #ffffff; font-size: 24px; padding: 10px 20px; border-radius: 6px; font-weight: bold;">
                  ${otp}
                </span>
              </p>         
              <p style="font-size: 14px; color: #666;">
                This OTP is valid for <strong>3 minutes</strong>. Please do not share it with anyone.
              </p>       
              <p style="font-size: 16px;">
                Regards,<br/>
                <strong>The CinemaStream Team</strong>
              </p>
            </div>
          `);
          

            //new
    regenerateCsrfToken(req, res);

        res.json({ status: "SUCCESS", message: "Signup successful. OTP sent." });
    
   
    } catch (err) {
        console.error('Signup error:', err);
        res.json({ status: "FAILED", message: "Signup failed due to server error" });
    }
});

module.exports = router;