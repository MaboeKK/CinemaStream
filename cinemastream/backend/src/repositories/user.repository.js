const pool = require('../config/db');

// All raw SQL for the `users` table lives here. Every query is parameterized.

const createUser = async (first_name, last_name, email, hashedPassword, otp, otpExpiry) => {
  await pool.query(
    'INSERT INTO users (first_name, last_name, email, password, verification_token, otp_expiry, is_verified) VALUES ($1, $2, $3, $4, $5, $6, false)',
    [first_name, last_name, email, hashedPassword, otp, otpExpiry]
  );
};

const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const updatePassword = async (email, hashedPassword) => {
  await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
};

const saveResetToken = async (email, resetToken, expiry) => {
  await pool.query('UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3', [
    resetToken,
    expiry,
    email,
  ]);
};

const clearResetToken = async (email) => {
  await pool.query(
    'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE email = $1',
    [email]
  );
};

const findByEmailAndResetToken = async (email, resetToken) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND reset_token = $2', [
    email,
    resetToken,
  ]);
  return result.rows[0];
};

const markAsVerified = async (userId) => {
  await pool.query(
    'UPDATE users SET is_verified = true, verification_token = NULL, otp_expiry = NULL WHERE user_id = $1',
    [userId]
  );
};

const getBasicInfoById = async (userId) => {
  const result = await pool.query(
    'SELECT first_name, last_name, email, role FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

const listAll = async () => {
  const result = await pool.query(
    'SELECT user_id, first_name, last_name, email, role, is_verified FROM users ORDER BY user_id'
  );
  return result.rows;
};

const updateOtp = async (userId, otp, expiry) => {
  await pool.query('UPDATE users SET verification_token = $1, otp_expiry = $2 WHERE user_id = $3', [
    otp,
    expiry,
    userId,
  ]);
};

module.exports = {
  createUser,
  findByEmail,
  updatePassword,
  saveResetToken,
  clearResetToken,
  findByEmailAndResetToken,
  markAsVerified,
  getBasicInfoById,
  updateOtp,
  listAll,
};
