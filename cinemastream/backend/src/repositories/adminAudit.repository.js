const pool = require('../config/db');

const record = async ({ actorUserId, actorEmail, action, targetUserId, targetEmail, metadata }) => {
  await pool.query(
    `INSERT INTO admin_audit_log (actor_user_id, actor_email, action, target_user_id, target_email, metadata)
     VALUES ($1, $2, $3, $4, $5, $6)`,
    [actorUserId, actorEmail, action, targetUserId || null, targetEmail || null, metadata || null]
  );
};

const list = async ({ page = 1, pageSize = 25, actorId, action } = {}) => {
  const conditions = [];
  const params = [];

  if (actorId) {
    params.push(actorId);
    conditions.push(`actor_user_id = $${params.length}`);
  }
  if (action) {
    params.push(action);
    conditions.push(`action = $${params.length}`);
  }

  const where = conditions.length ? `WHERE ${conditions.join(' AND ')}` : '';

  const countResult = await pool.query(`SELECT COUNT(*) AS count FROM admin_audit_log ${where}`, params);

  params.push(pageSize, (page - 1) * pageSize);
  const rowsResult = await pool.query(
    `SELECT id, actor_user_id, actor_email, action, target_user_id, target_email, metadata, created_at
     FROM admin_audit_log ${where}
     ORDER BY created_at DESC
     LIMIT $${params.length - 1} OFFSET $${params.length}`,
    params
  );

  return { rows: rowsResult.rows, total: Number(countResult.rows[0].count) };
};

module.exports = { record, list };
