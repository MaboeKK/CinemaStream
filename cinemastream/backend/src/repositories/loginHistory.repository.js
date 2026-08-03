const pool = require('../config/db');

const recordLogin = async ({ userId, firstName, lastName, email, ipAddress, userAgent }) => {
  await pool.query(
    `INSERT INTO login_history (user_id, first_name, last_name, email, ip_address, user_agent)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [userId, firstName, lastName, email, ipAddress, userAgent]
  );
};

// Postgres UPDATE doesn't support ORDER BY/LIMIT directly, so the target
// row is picked via a subquery instead.
const recordLogout = async (userId) => {
  await pool.query(
    `UPDATE login_history
     SET logout_time = CURRENT_TIMESTAMP
     WHERE id = (
       SELECT id FROM login_history
       WHERE user_id = $1 AND was_successful = true AND logout_time IS NULL
       ORDER BY login_time DESC
       LIMIT 1
     )`,
    [userId]
  );
};

// Distinct users with at least one successful login -- the "active" half
// of the admin Stats page's users-active-of-total figure.
const getActiveUserCount = async () => {
  const { rows } = await pool.query(
    'SELECT COUNT(DISTINCT user_id) AS count FROM login_history WHERE was_successful = true'
  );
  return Number(rows[0].count);
};

module.exports = { recordLogin, recordLogout, getActiveUserCount };
