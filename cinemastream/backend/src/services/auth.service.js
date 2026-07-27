const bcrypt = require('bcrypt');
const userRepository = require('../repositories/user.repository');
const loginHistoryRepository = require('../repositories/loginHistory.repository');
const tokenService = require('./token.service');
const otpService = require('./otp.service');
const emailService = require('./email.service');
const { REFRESH_TOKEN_MAX_AGE, REFRESH_TOKEN_MAX_AGE_SHORT } = require('../utils/cookies');

const OTP_TTL_MS = 3 * 60 * 1000;

// Every function here returns a plain result object -- { ok: true, ... } or
// { ok: false, message } -- rather than throwing, so controllers can map
// each expected business outcome to the exact response shape callers
// already depend on (e.g. Login.js branches on the literal message string
// "Please verify your email to login"). Throwing is reserved for genuinely
// unexpected failures, which propagate to asyncHandler -> errorHandler.

const buildOtpEmail = (firstName, otp) => `
  <div style="font-family: Helvetica,Arial,sans-serif;line-height:2">
      <p>Hi ${firstName},</p>
      <p>Thank you for choosing Cinema-Stream. Use the following OTP to complete your Sign Up procedures.</p>
      <h2 style="background:rgb(106, 0, 0);width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
      <p>OTP is valid for 3 minutes</p>
      <p>Regards,<br/>Cinema-Stream</p>
  </div>`;

const register = async ({ first_name, last_name, email, password }) => {
  const existingUser = await userRepository.findByEmail(email);
  if (existingUser) {
    return { ok: false, message: 'User already exists' };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const otp = otpService.generateOtp();
  const otpExpiry = new Date(Date.now() + OTP_TTL_MS);

  await userRepository.createUser(first_name, last_name, email, hashedPassword, otp, otpExpiry);

  await emailService.sendHTMLEmail(
    email,
    'Your OTP for Email Verification',
    buildOtpEmail(first_name, otp)
  );

  return { ok: true, message: 'Signup successful. OTP sent.' };
};

const buildSessionTokens = (user, { rememberMe } = {}) => {
  const accessToken = tokenService.signAccessToken(user);
  const refreshToken = tokenService.signRefreshToken(user);
  const refreshMaxAge = rememberMe ? REFRESH_TOKEN_MAX_AGE : REFRESH_TOKEN_MAX_AGE_SHORT;
  return { accessToken, refreshToken, refreshMaxAge };
};

const login = async ({ email, password, rememberMe, ipAddress, userAgent }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return { ok: false, message: 'User not found' };
  }

  if (!user.is_verified) {
    return { ok: false, message: 'Please verify your email to login' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { ok: false, message: 'Incorrect password' };
  }

  await loginHistoryRepository.recordLogin({
    userId: user.user_id,
    firstName: user.first_name,
    lastName: user.last_name,
    email: user.email,
    ipAddress,
    userAgent,
  });

  const { accessToken, refreshToken, refreshMaxAge } = buildSessionTokens(user, { rememberMe });

  return {
    ok: true,
    message: 'Login successful',
    accessToken,
    refreshToken,
    refreshMaxAge,
    userData: {
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      role: user.role,
    },
  };
};

const logout = async (userId) => {
  await loginHistoryRepository.recordLogout(userId);
  return { ok: true };
};

const verifyOtp = async ({ email, otp }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return { ok: false, message: 'User not found' };
  }

  if (user.is_verified) {
    return { ok: false, message: 'User already verified' };
  }

  const now = new Date();
  if (user.verification_token !== otp || now > user.otp_expiry) {
    return { ok: false, message: 'Invalid or expired OTP' };
  }

  await userRepository.markAsVerified(user.user_id);

  // Same session shape as a normal login (access + refresh + role claim),
  // so a freshly verified session behaves identically to one from /login.
  const { accessToken, refreshToken, refreshMaxAge } = buildSessionTokens(user);

  return {
    ok: true,
    message: 'Email verified and user logged in',
    accessToken,
    refreshToken,
    refreshMaxAge,
  };
};

const resendOtp = async ({ email }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return { ok: false, message: 'User not found' };
  }

  const otp = otpService.generateOtp();
  const expiry = new Date(Date.now() + OTP_TTL_MS);

  await userRepository.updateOtp(user.user_id, otp, expiry);

  await emailService.sendHTMLEmail(
    email,
    'Your OTP for Email Verification',
    `
      <div style="font-family: Helvetica,Arial,sans-serif;line-height:2">
        <p>Here is your new OTP for Cinema-Stream:</p>
        <h2 style="background:rgb(106, 0, 0);width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${otp}</h2>
        <p>OTP is valid for 3 minutes</p>
        <p>Regards,<br/>Cinema-Stream</p>
      </div>`
  );

  return { ok: true, message: 'OTP resent successfully' };
};

const forgotPassword = async ({ email }) => {
  const user = await userRepository.findByEmail(email);
  if (!user) {
    return { ok: false, message: 'User not found' };
  }

  const resetToken = otpService.generateOtp();
  const expiry = new Date(Date.now() + OTP_TTL_MS);
  await userRepository.saveResetToken(email, resetToken, expiry);

  await emailService.sendHTMLEmail(
    email,
    'Your Password Reset OTP',
    `
      <div style="font-family: Helvetica,Arial,sans-serif;line-height:2">
        <p>Your password reset OTP is: </p>
        <h2 style="background:rgb(106, 0, 0);width: max-content;padding: 0 10px;color: #fff;border-radius: 4px;">${resetToken}</h2>
        <p>OTP is valid for 3 minutes</p>
        <p>Regards,<br/>Cinema-Stream</p>
      </div>`
  );

  return { ok: true, message: 'Reset OTP sent to your email.' };
};

const resetPassword = async ({ email, resetToken, newPassword }) => {
  const user = await userRepository.findByEmailAndResetToken(email, resetToken);
  if (!user) {
    return { ok: false, message: 'Invalid reset token' };
  }

  if (new Date() > user.reset_token_expiry) {
    return { ok: false, message: 'Reset token expired' };
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  await userRepository.updatePassword(email, hashedPassword);
  await userRepository.clearResetToken(email);

  return { ok: true, message: 'Password reset successful.' };
};

const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    return { ok: false, message: 'No refresh token' };
  }

  try {
    const payload = tokenService.verifyRefreshToken(refreshToken);
    const accessToken = tokenService.signAccessToken({
      user_id: payload.userId,
      role: payload.role,
    });
    return { ok: true, accessToken };
  } catch {
    return { ok: false, message: 'Invalid refresh token' };
  }
};

const checkAuth = async (userId) => {
  return userRepository.getBasicInfoById(userId);
};

module.exports = {
  register,
  login,
  logout,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  refreshAccessToken,
  checkAuth,
};
