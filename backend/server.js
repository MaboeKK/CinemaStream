// Connect to DB
try {
  require('./config/db');
} catch (err) {
  console.error('Failed to connect to DB:', err);
}

const express = require('express');
const cors = require('cors');

const app = express();
const port = 5000;

// Middlewares
app.use(cors()); //  Allow requests from React frontend
app.use(express.json()); //  Accept JSON POST bodies
const cookieParser = require('cookie-parser');

// Routes
// const userRoutes = require('./api/User'); // Or ./routes/User if that's the folder name
// app.use('/api/auth', userRoutes); //  Route now matches frontend
/* const forgotPasswordRoute = require("./api/forgotPassword");
const resetPasswordRoute = require('./api/resetPassword');
app.use("/api/auth", forgotPasswordRoute);
app.use('/api/auth', resetPasswordRoute); */
app.use(cookieParser());
app.use('/api/auth', require('./api/forgotPassword'));
app.use('/api/auth', require('./api/resetPassword'));
app.use('/api/auth', require('./api/register'));
app.use('/api/auth', require('./api/login'));
app.use('/api/auth', require('./api/verifyOtp'));

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
