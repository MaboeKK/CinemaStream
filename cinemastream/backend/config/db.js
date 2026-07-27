require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
    connectionString:
    process.env.POSTGRES_URI
});

pool.query('SELECT NOW()')
.then(() => console.log("PostgreSQL pool connected"))
.catch((err) => console.error("Pool connection error", err.stack));

module.exports = pool;