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
app.use(cors()); // ✅ Allow requests from React frontend
app.use(express.json()); // ✅ Accept JSON POST bodies

// Routes
const userRoutes = require('./api/User'); // Or ./routes/User if that's the folder name
app.use('/api/auth', userRoutes); // ✅ Route now matches frontend

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});