require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const watchRoutes = require("./routes/watch");
app.use(cors());
app.use(express.json());

app.use('/api/track', require('./routes/track'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/catalog', require('./routes/catalog'));
app.use('/api/users', require('./routes/users'));
app.use("/api/watch", watchRoutes);
module.exports = app;
