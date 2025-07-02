require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
app.use(express.json());

app.use('/api/track', require('./routes/track'));
app.use('/api/stats', require('./routes/stats'));
app.use('/api/catalog', require('./routes/catalog'));
app.use('/api/users', require('./routes/users'));
app.use("/api/watch", require("./routes/watch"));
module.exports = app;
