const { Pool } = require('pg');
const { POSTGRES_URI } = require('./env');

const pool = new Pool({ connectionString: POSTGRES_URI });

// Without this, an unexpected error on an idle client (e.g. the DB dropping
// the connection) is an unhandled 'error' event and crashes the process.
pool.on('error', (err) => {
  console.error('Unexpected error on idle Postgres client', err);
});

pool
  .query('SELECT NOW()')
  .then(() => console.log('PostgreSQL pool connected'))
  .catch((err) => console.error('Pool connection error', err.stack));

module.exports = pool;
