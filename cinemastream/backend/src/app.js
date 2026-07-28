const express = require('express');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const { CORS_ORIGIN } = require('./config/env');

const authRoutes = require('./routes/auth.routes');
const protectedRoutes = require('./routes/protected.routes');
const watchRoutes = require('./routes/watch.routes');
const adminRoutes = require('./routes/admin.routes');
const errorHandler = require('./middleware/errorHandler');

const app = express();

app.use(
  cors({
    origin: CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

// Trust proxy (important for secure cookies behind proxies like Nginx)
app.set('trust proxy', 1);

app.use('/api/auth', authRoutes);
app.use('/api/protected', protectedRoutes);
app.use('/api/watch', watchRoutes);
app.use('/api/admin', adminRoutes);

app.get('/health', (_, res) => res.send('OK'));

// Must be registered last -- catches errors forwarded by asyncHandler from any route above.
app.use(errorHandler);

module.exports = app;
