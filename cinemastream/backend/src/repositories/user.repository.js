const pool = require('../config/db');

// All raw SQL for the `users` table lives here. Every query is parameterized.

const createUser = async (first_name, last_name, email, hashedPassword, otp, otpExpiry) => {
  await pool.query(
    'INSERT INTO users (first_name, last_name, email, password, verification_token, otp_expiry, is_verified) VALUES ($1, $2, $3, $4, $5, $6, false)',
    [first_name, last_name, email, hashedPassword, otp, otpExpiry]
  );
};

const findByEmail = async (email) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const updatePassword = async (email, hashedPassword) => {
  await pool.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
};

const saveResetToken = async (email, resetToken, expiry) => {
  await pool.query('UPDATE users SET reset_token = $1, reset_token_expiry = $2 WHERE email = $3', [
    resetToken,
    expiry,
    email,
  ]);
};

const clearResetToken = async (email) => {
  await pool.query(
    'UPDATE users SET reset_token = NULL, reset_token_expiry = NULL WHERE email = $1',
    [email]
  );
};

const findByEmailAndResetToken = async (email, resetToken) => {
  const result = await pool.query('SELECT * FROM users WHERE email = $1 AND reset_token = $2', [
    email,
    resetToken,
  ]);
  return result.rows[0];
};

const markAsVerified = async (userId) => {
  await pool.query(
    'UPDATE users SET is_verified = true, verification_token = NULL, otp_expiry = NULL WHERE user_id = $1',
    [userId]
  );
};

const getBasicInfoById = async (userId) => {
  const result = await pool.query(
    'SELECT user_id, first_name, last_name, email, role, status FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

// Re-checked on every request (auth.middleware.js) and on every refresh
// (auth.service.js) -- deliberately minimal columns since it's on the hot
// path for every authenticated request.
const getAuthState = async (userId) => {
  const result = await pool.query(
    'SELECT role, status, token_version, email FROM users WHERE user_id = $1',
    [userId]
  );
  return result.rows[0];
};

const ALLOWED_SORT_COLUMNS = new Set(['user_id', 'first_name', 'last_name', 'email', 'role', 'status', 'created_at']);

// Server-side search/filter/sort/pagination for the admin Users table --
// listAll() above stays untouched since it's still used by adminStats'
// getOverview() total-users passthrough shape elsewhere.
const listPaged = async ({ search, role, status, page = 1, pageSize = 25, sortBy = 'user_id', sortDir = 'asc' }) => {
  const conditions = [];
  const params = [];

  if (search) {
    params.push(`%${search}%`);
    conditions.push(
      `(email ILIKE $${params.length} OR first_name ILIKE $${params.length} OR last_name ILIKE $${params.length})`
    );
  }
  if (role) {
    params.push(role);
    conditions.push(`role = $${params.length}`);
  }
  if (status) {
    params.push(status);
    conditions.push(`status = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';
  const column = ALLOWED_SORT_COLUMNS.has(sortBy) ? sortBy : 'user_id';
  const direction = sortDir === 'desc' ? 'DESC' : 'ASC';

  const countResult = await pool.query(`SELECT COUNT(*) AS count FROM users ${where}`, params);

  params.push(pageSize, (page - 1) * pageSize);
  const rowsResult = await pool.query(
    `SELECT user_id, first_name, last_name, email, role, status, is_verified, last_login_at, created_at
     FROM users ${where}
     ORDER BY ${column} ${direction}
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return { rows: rowsResult.rows, total: Number(countResult.rows[0].count) };
};

const getById = async (userId) => {
  const result = await pool.query(
    `SELECT user_id, first_name, last_name, email, role, status, status_reason, status_changed_at,
            is_verified, last_login_at, created_at
     FROM users WHERE user_id = $1`,
    [userId]
  );
  return result.rows[0];
};

// RETURNING is deliberately scoped to safe columns, not * -- the row also
// carries the bcrypt password hash and reset/verification tokens, which
// must never round-trip into an API response.
const SAFE_RETURNING = 'user_id, first_name, last_name, email, role, status, status_reason, status_changed_at, is_verified, last_login_at, created_at';

const updateRole = async (userId, role) => {
  const result = await pool.query(`UPDATE users SET role = $1 WHERE user_id = $2 RETURNING ${SAFE_RETURNING}`, [
    role,
    userId,
  ]);
  return result.rows[0];
};

const updateStatus = async (userId, status, reason) => {
  const result = await pool.query(
    `UPDATE users SET status = $1, status_reason = $2, status_changed_at = now()
     WHERE user_id = $3 RETURNING ${SAFE_RETURNING}`,
    [status, reason || null, userId]
  );
  return result.rows[0];
};

const bumpTokenVersion = async (userId) => {
  await pool.query('UPDATE users SET token_version = token_version + 1 WHERE user_id = $1', [userId]);
};

const countByRole = async (role) => {
  const result = await pool.query('SELECT COUNT(*) AS count FROM users WHERE role = $1', [role]);
  return Number(result.rows[0].count);
};

const touchLastLogin = async (userId) => {
  await pool.query('UPDATE users SET last_login_at = now() WHERE user_id = $1', [userId]);
};

// Signup -> verified -> first-watch counts. "First watch" = appears at
// least once in watched_history at all, not a specific title.
const getSignupFunnel = async () => {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*) AS signed_up,
      COUNT(*) FILTER (WHERE is_verified) AS verified,
      COUNT(*) FILTER (
        WHERE user_id IN (SELECT DISTINCT user_id FROM watched_history)
      ) AS first_watched
    FROM users
  `);
  return {
    signedUp: Number(rows[0].signed_up),
    verified: Number(rows[0].verified),
    firstWatched: Number(rows[0].first_watched),
  };
};

// Simple month-over-month retention: for each signup-month cohort, what
// fraction of that cohort had at least one successful login in each
// subsequent month (up to 6 months out). Not a full BI cohort tool --
// enough to answer "are people coming back."
const getRetentionCohorts = async () => {
  const { rows } = await pool.query(`
    WITH cohorts AS (
      SELECT user_id, DATE_TRUNC('month', created_at) AS cohort_month
      FROM users
      WHERE created_at >= NOW() - INTERVAL '7 months'
    ),
    activity AS (
      SELECT DISTINCT user_id, DATE_TRUNC('month', login_time) AS active_month
      FROM login_history
      WHERE was_successful = true
    )
    SELECT
      c.cohort_month,
      COUNT(DISTINCT c.user_id) AS cohort_size,
      (EXTRACT(YEAR FROM a.active_month) - EXTRACT(YEAR FROM c.cohort_month)) * 12
        + (EXTRACT(MONTH FROM a.active_month) - EXTRACT(MONTH FROM c.cohort_month)) AS month_offset,
      COUNT(DISTINCT a.user_id) AS active_count
    FROM cohorts c
    LEFT JOIN activity a ON a.user_id = c.user_id AND a.active_month >= c.cohort_month
    GROUP BY c.cohort_month, month_offset
    ORDER BY c.cohort_month, month_offset
  `);
  return rows.map((row) => ({
    cohortMonth: row.cohort_month.toISOString().split('T')[0],
    cohortSize: Number(row.cohort_size),
    monthOffset: row.month_offset === null ? null : Number(row.month_offset),
    activeCount: Number(row.active_count),
  }));
};

const countAll = async () => {
  const result = await pool.query('SELECT COUNT(*) AS count FROM users');
  return Number(result.rows[0].count);
};

const updateOtp = async (userId, otp, expiry) => {
  await pool.query('UPDATE users SET verification_token = $1, otp_expiry = $2 WHERE user_id = $3', [
    otp,
    expiry,
    userId,
  ]);
};

module.exports = {
  createUser,
  findByEmail,
  updatePassword,
  saveResetToken,
  clearResetToken,
  findByEmailAndResetToken,
  markAsVerified,
  getBasicInfoById,
  getAuthState,
  updateOtp,
  listPaged,
  getById,
  updateRole,
  updateStatus,
  bumpTokenVersion,
  countByRole,
  touchLastLogin,
  getSignupFunnel,
  getRetentionCohorts,
  countAll,
};
