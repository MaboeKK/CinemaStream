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

// Grouped by (content id, type) rather than the title string -- grouping by
// name alone would silently merge two different titles that happen to
// share a title (remakes exist on TMDB), and gave the frontend nothing
// stable to key rows on. MAX(...) for the display name is safe since a
// given (movie_id, type) pair's title is effectively constant.
const getTopShows = async () => {
  const { rows } = await pool.query(`
    SELECT
      COALESCE(movie_id, series_id) AS content_id,
      CASE WHEN movie_id IS NOT NULL THEN 'Movie' ELSE 'Series' END AS type,
      MAX(COALESCE(movie_title, series_name)) AS name,
      COUNT(*) AS total_views
    FROM watched_history
    GROUP BY COALESCE(movie_id, series_id), CASE WHEN movie_id IS NOT NULL THEN 'Movie' ELSE 'Series' END
    ORDER BY total_views DESC
    LIMIT 10
  `);
  return rows.map((row) => ({ ...row, total_views: Number(row.total_views) }));
};

// Returns both the new-signups-that-month count and a running cumulative
// total (seeded with however many users already existed before the
// 12-month window) -- a single "count" was previously mislabeled on the
// frontend as "Registered Users" when it was really new signups, which
// reads as a running total but isn't one.
const getMonthlyUserGrowth = async () => {
  const { rows } = await pool.query(`
    WITH month_series AS (
      SELECT DATE_TRUNC('month', NOW() - INTERVAL '1 month' * (n - 1)) AS month
      FROM generate_series(1, 12) AS n
    ),
    monthly_new AS (
      SELECT ms.month, COUNT(u.user_id) AS new_signups
      FROM month_series ms
      LEFT JOIN users u ON DATE_TRUNC('month', u.created_at) = ms.month
      GROUP BY ms.month
    ),
    base AS (
      SELECT COUNT(*) AS base_count FROM users WHERE created_at < (SELECT MIN(month) FROM month_series)
    )
    SELECT
      monthly_new.month,
      monthly_new.new_signups,
      base.base_count + SUM(monthly_new.new_signups) OVER (ORDER BY monthly_new.month) AS cumulative_total
    FROM monthly_new, base
    ORDER BY monthly_new.month
  `);
  return rows.map((row) => ({
    date: row.month.toISOString().split('T')[0],
    newSignups: Number(row.new_signups),
    cumulativeTotal: Number(row.cumulative_total),
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

// "Rewatches" = total watch events minus distinct (user, title) pairs --
// i.e. how many of those events were a repeat play of something the same
// user already had a watched_history row for. COALESCE avoids the row
// constructor treating two NULLs in the unused id column as distinct.
const getPlatformOverview = async () => {
  const { rows } = await pool.query(`
    SELECT
      COUNT(*) AS total_watched,
      COUNT(*) - COUNT(DISTINCT (user_id, COALESCE(movie_id, -1), COALESCE(series_id, -1))) AS rewatches
    FROM watched_history
  `);
  return {
    totalWatched: Number(rows[0].total_watched),
    rewatches: Number(rows[0].rewatches),
  };
};

module.exports = {
  recordWatch,
  getRecentByUser,
  getTopShows,
  getMonthlyUserGrowth,
  getHeatmapData,
  getPlatformOverview,
};
