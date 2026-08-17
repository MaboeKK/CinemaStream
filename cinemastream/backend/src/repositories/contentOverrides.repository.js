const pool = require('../config/db');

const list = async (status) => {
  const result = status
    ? await pool.query('SELECT * FROM content_overrides WHERE status = $1 ORDER BY created_at DESC', [
        status,
      ])
    : await pool.query('SELECT * FROM content_overrides ORDER BY created_at DESC');
  return result.rows;
};

// One row per (tmdb_id, media_type) -- re-featuring/re-blocking a title (or
// flipping it from one to the other) updates the existing row instead of
// erroring on the unique constraint.
const upsert = async ({ tmdbId, mediaType, title, status, createdBy }) => {
  const result = await pool.query(
    `INSERT INTO content_overrides (tmdb_id, media_type, title, status, created_by)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (tmdb_id, media_type)
     DO UPDATE SET title = EXCLUDED.title, status = EXCLUDED.status, created_by = EXCLUDED.created_by, created_at = now()
     RETURNING *`,
    [tmdbId, mediaType, title, status, createdBy]
  );
  return result.rows[0];
};

const remove = async (id) => {
  const result = await pool.query('DELETE FROM content_overrides WHERE id = $1 RETURNING *', [id]);
  return result.rows[0];
};

module.exports = { list, upsert, remove };
