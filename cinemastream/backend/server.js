// Load environment variables
require('dotenv').config(); // Access process.env variables

// Connect to DB
try {
  require('./config/db');
} catch (err) {
  console.error('Failed to connect to DB:', err);
  process.exit(1);
}

const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const app = express();
const port = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

// Trust proxy (important for secure cookies behind proxies like Nginx)
app.set('trust proxy', 1);

// Routes
app.use('/api/auth', require('./api/forgotPassword'));
app.use('/api/auth', require('./api/resetPassword'));
app.use('/api/auth', require('./api/register'));
app.use('/api/auth', require('./api/login'));
app.use('/api/auth', require('./api/verifyOtp'));
app.use('/api/auth', require('./api/resendOtp'));
app.use('/api/auth', require('./api/checkAuth'));
app.use('/api/auth', require('./api/refreshToken'));
app.use('/api/protected', require('./api/protectedRoutes'));

app.use('/api/auth', require('./api/csrfToken'));

// Health check route (optional)
app.get('/health', (_, res) => res.send('OK'));

// Start server
app.listen(port, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${port}`);
});
