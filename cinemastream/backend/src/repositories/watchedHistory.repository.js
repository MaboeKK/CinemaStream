const pool = require('../config/db');

const recordWatch = async ({ userId, movieId, seriesId, movieTitle, seriesName }) => {
  await pool.query(
    `INSERT INTO watched_history (user_id, movie_id, series_id, movie_title, series_name)
     VALUES ($1, $2, $3, $4, $5)`,
    [userId, movieId || null, seriesId || null, movieTitle || null, seriesName || null]
  );
};

const getRecentByUser = async (userId, limit = 10) => {
  const { rows } = await pool.query(
    `SELECT movie_id, series_id, movie_title, series_name, MAX(watched_at) AS watched_at
     FROM watched_history
     WHERE user_id = $1
     GROUP BY movie_id, series_id, movie_title, series_name
     ORDER BY watched_at DESC
     LIMIT $2`,
    [userId, limit]
  );
  return rows;
};

const getTopShows = async () => {
  const { rows } = await pool.query(`
    SELECT
      COALESCE(movie_title, series_name) AS name,
      CASE WHEN movie_id IS NOT NULL THEN 'Movie' ELSE 'Series' END AS type,
      COUNT(*) AS total_views
    FROM watched_history
    GROUP BY COALESCE(movie_title, series_name), CASE WHEN movie_id IS NOT NULL THEN 'Movie' ELSE 'Series' END
    ORDER BY total_views DESC
    LIMIT 10
  `);
  return rows;
};

const getMonthlyUserGrowth = async () => {
  const { rows } = await pool.query(`
    WITH month_series AS (
      SELECT DATE_TRUNC('month', NOW() - INTERVAL '1 month' * (n - 1)) AS month
      FROM generate_series(1, 12) AS n
    )
    SELECT ms.month, COALESCE(COUNT(u.created_at), 0) AS count
    FROM month_series ms
    LEFT JOIN users u ON DATE_TRUNC('month', u.created_at) = ms.month
    GROUP BY ms.month
    ORDER BY ms.month
  `);
  return rows.map((row) => ({
    date: row.month.toISOString().split('T')[0],
    count: Number(row.count),
  }));
};

const getHeatmapData = async () => {
  const { rows } = await pool.query(`
    WITH time_buckets AS (
      SELECT
        TO_CHAR(watched_at, 'FMDay') AS day,
        CASE
          WHEN EXTRACT(HOUR FROM watched_at) BETWEEN 6 AND 11 THEN 'Morning'
          WHEN EXTRACT(HOUR FROM watched_at) BETWEEN 12 AND 17 THEN 'Afternoon'
          WHEN EXTRACT(HOUR FROM watched_at) BETWEEN 18 AND 23 THEN 'Evening'
          ELSE 'Night'
        END AS period
      FROM watched_history
    )
    SELECT day, period, COUNT(*) AS count
    FROM time_buckets
    GROUP BY day, period
    ORDER BY
      CASE day
        WHEN 'Monday' THEN 1 WHEN 'Tuesday' THEN 2 WHEN 'Wednesday' THEN 3
        WHEN 'Thursday' THEN 4 WHEN 'Friday' THEN 5 WHEN 'Saturday' THEN 6
        WHEN 'Sunday' THEN 7
      END,
      CASE period
        WHEN 'Morning' THEN 1 WHEN 'Afternoon' THEN 2 WHEN 'Evening' THEN 3 WHEN 'Night' THEN 4
      END
  `);
  return rows.map((row) => ({ ...row, count: Number(row.count) }));
};

module.exports = {
  recordWatch,
  getRecentByUser,
  getTopShows,
  getMonthlyUserGrowth,
  getHeatmapData,
};
