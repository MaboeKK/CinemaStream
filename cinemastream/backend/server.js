// Load environment variables
require('dotenv').config(); // ✅ Needed to access process.env.JWT_SECRET

// Connect to DB
try {
  require('./config/db');
} catch (err) {
  console.error('Failed to connect to DB:', err);
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/auth', require('./api/forgotPassword'));
app.use('/api/auth', require('./api/resetPassword'));
app.use('/api/auth', require('./api/register'));
app.use('/api/auth', require('./api/login'));
app.use('/api/auth', require('./api/verifyOtp'));
app.use('/api/auth', require('./api/checkAuth'));
app.use('/api/protected', require('./api/protectedRoutes'));
app.use('/api/auth', require('./api/refreshToken'));

app.set('trust proxy', 1); // trust first proxy

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});