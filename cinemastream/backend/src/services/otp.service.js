const crypto = require('crypto');

// 6-digit numeric OTP, generated with a CSPRNG rather than Math.random().
const generateOtp = () => crypto.randomInt(100000, 1000000).toString();

module.exports = { generateOtp };
