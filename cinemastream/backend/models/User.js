const pool = require("../config/db");

const createUser = async (first_name, last_name, email, hashedPassword, otp, otpExpiry) => {
  await pool.query(
    'INSERT INTO users (first_name, last_name, email, password, verification_token, otp_expiry, is_verified) VALUES ($1, $2, $3, $4, $5, $6, false)',
    [first_name, last_name, email, hashedPassword, otp, otpExpiry]
  );
};

const findUserByEmail = async (email) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return result.rows[0]; // returns user object or undefined if not found
};

const updateUserPassword = async (email, hashedPassword) => {
  await pool.query("UPDATE users SET password = $1 WHERE email = $2", [hashedPassword, email]);
};

// NEW: Save reset OTP and expiry to DB
const saveResetToken = async (email, resetToken, expiry) => {
  await pool.query(
    'UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3',
    [resetToken, expiry, email]
  );
};

// NEW: Clear reset token after successful password reset
const clearResetToken = async (email) => {
  await pool.query(
    'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE email = $1',
    [email]
  );
};

const getUserByResetToken = async (token) => {
  const result = await pool.query("SELECT * FROM users WHERE reset_token = $1", [token]);
  return result.rows[0];
};


const getUserByEmailAndResetToken = async (email, resetToken) => {
  const result = await pool.query(
    'SELECT * FROM users WHERE email = $1 AND reset_token = $2',
    [email, resetToken]
  );
  return result.rows[0];
};

//Marks user as verified in the db
const markUserAsVerified = async (userId) => {
  await pool.query(
    'UPDATE users SET is_verified = true, verification_token = NULL, otp_expiry = NULL WHERE user_id = $1',
    [userId]
  );
};

//Get User Info By Id
const getBasicUserInfoById = async (userId) => {
  const result = await pool.query(
    'SELECT first_name, last_name, email FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

// update user's OTP
async function updateOtpInDb(userId, otp, expiry) {
  const query = 'UPDATE users SET verification_token = $1, otp_expiry = $2 WHERE user_id = $3';
  await pool.query(query, [otp, expiry, userId]);
}

// dummy email sender (you can replace this with nodemailer or any real service)
async function sendOtpToUser(email, otp) {
  console.log(`Sending OTP ${otp} to ${email}`);
}

module.exports = {
  createUser, findUserByEmail, updateUserPassword, clearResetToken,
  getUserByResetToken, saveResetToken, getUserByEmailAndResetToken, markUserAsVerified,
  getBasicUserInfoById, updateOtpInDb, sendOtpToUser
};
