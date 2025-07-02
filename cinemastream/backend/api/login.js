const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const pool = require('../config/db');
const crypto = require('crypto');
const authLimiter = require('../middleware/rateLimiter');
const jwt = require('jsonwebtoken');
const { csrfProtection, regenerateCsrfToken, generateCsrfToken } = require('../middleware/csrfProtection');

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

    // Log login attempt
    await pool.query(
      `INSERT INTO login_history (user_id, first_name, last_name, email, ip_address, user_agent)
   VALUES ($1, $2, $3, $4, $5, $6)`,
      [
        user.user_id,
        user.first_name,
        user.last_name,
        user.email,
        req.ip || req.connection.remoteAddress,
        req.headers['user-agent'] || 'unknown'
      ]
    );

    // Create access token (short-lived)
    const accessToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '15m' }
    );

    // Create refresh token (long-lived)
    const refreshToken = jwt.sign(
      { userId: user.id, role: user.role },
      process.env.REFRESH_SECRET,
      { expiresIn: '7d' }
    );

    // Set access token in httpOnly cookie
    res.cookie('access_token', accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
      maxAge: 15 * 60 * 1000 // 15 minutes
    });

    // Set refresh token in httpOnly cookie
    const rememberMe = req.body.rememberMe;

    // Later when setting the refresh token
    const refreshExpiry = rememberMe ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000; // 7 days vs 1 hour

    res.cookie('refresh_token', refreshToken, {
      httpOnly: true,
      secure: false,
      sameSite: 'Strict',
      maxAge: refreshExpiry
    });

    regenerateCsrfToken(req, res);

    // Send response
    res.json({
      status: "SUCCESS",
      message: "Login successful",
      data: {
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role
      }
    });


  } catch (error) {
    console.error('Login error:', error);
    res.json({ status: "FAILED", message: "An error occurred during login" });
  }
});

module.exports = router;