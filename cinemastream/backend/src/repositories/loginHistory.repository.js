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

// Most-recent-first, for the admin user-detail view.
const getRecentByUser = async (userId, limit = 10) => {
  const { rows } = await pool.query(
    `SELECT login_time, logout_time, ip_address, user_agent, was_successful
     FROM login_history WHERE user_id = $1 ORDER BY login_time DESC LIMIT $2`,
    [userId, limit]
  );
  return rows;
};

// Daily average session length over the last 30 days, for closed sessions
// only (logout_time IS NULL means still-open or never-properly-closed).
const getAvgSessionLengthByDay = async () => {
  const { rows } = await pool.query(`
    SELECT
      DATE_TRUNC('day', login_time)::date AS day,
      AVG(EXTRACT(EPOCH FROM (logout_time - login_time))) AS avg_seconds,
      COUNT(*) AS session_count
    FROM login_history
    WHERE logout_time IS NOT NULL
      AND login_time >= NOW() - INTERVAL '30 days'
    GROUP BY DATE_TRUNC('day', login_time)
    ORDER BY day
  `);
  return rows.map((row) => ({
    date: row.day.toISOString().split('T')[0],
    avgSeconds: Math.round(Number(row.avg_seconds)),
    sessionCount: Number(row.session_count),
  }));
};

module.exports = {
  recordLogin,
  recordLogout,
  getActiveUserCount,
  getRecentByUser,
  getAvgSessionLengthByDay,
};
