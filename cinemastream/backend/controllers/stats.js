// // controllers/statsController.js
// const pool = require("../config/db");

// const getStats = async (req, res) => {
//   try {
//     const totalUsersRes = await pool.query("SELECT COUNT(*) FROM users");
//     const totalViewsRes = await pool.query("SELECT COUNT(*) FROM view_events");

//     const topTrailersRes = await pool.query(`
//       SELECT m.title, COUNT(*) AS views
//       FROM view_events v
//       JOIN movies m ON v.movie_id = m.id
//       WHERE v.trailer_watched = true
//       GROUP BY m.title
//       ORDER BY views DESC
//       LIMIT 5
//     `);

//     const dailyUsersRes = await pool.query(`
//       SELECT DATE(created_at) AS date, COUNT(*) AS count
//       FROM users
//       WHERE created_at > NOW() - INTERVAL '7 days'
//       GROUP BY DATE(created_at)
//       ORDER BY date
//     `);

//     const dailyTrailerViewsRes = await pool.query(`
//       SELECT DATE(viewed_at) AS date, COUNT(*) AS count
//       FROM view_events
//       WHERE trailer_watched = true AND viewed_at > NOW() - INTERVAL '7 days'
//       GROUP BY DATE(viewed_at)
//       ORDER BY date
//     `);

//     res.json({
//       users: Number(totalUsersRes.rows[0].count),
//       views: Number(totalViewsRes.rows[0].count),
//       topTrailers: topTrailersRes.rows,
//       dailyUsers: dailyUsersRes.rows,
//       dailyTrailerViews: dailyTrailerViewsRes.rows
//     });
//   } catch (err) {
//     console.error("Failed to fetch stats:", err);
//     res.status(500).json({ error: "Failed to get stats" });
//   }
// };

// module.exports = { getStats };

// controllers/statsController.js
const pool = require("../config/db");

// Your existing dashboard summary
exports.getStats = async (req, res) => {
  try {
    const totalUsersRes      = await pool.query("SELECT COUNT(*) FROM users");
    const totalViewsRes      = await pool.query("SELECT COUNT(*) FROM view_events");
    const topTrailersRes     = await pool.query(`
      SELECT m.title, COUNT(*) AS views
      FROM view_events v
      JOIN movies m ON v.movie_id = m.id
      WHERE v.trailer_watched = true
      GROUP BY m.title
      ORDER BY views DESC
      LIMIT 5
    `);
    const dailyUsersRes      = await pool.query(`
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM users
      WHERE created_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE(created_at)
      ORDER BY date
    `);
    const dailyTrailerViewsRes = await pool.query(`
      SELECT DATE(viewed_at) AS date, COUNT(*) AS count
      FROM view_events
      WHERE trailer_watched = true
        AND viewed_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE(viewed_at)
      ORDER BY date
    `);

    res.json({
      users: Number(totalUsersRes.rows[0].count),
      views: Number(totalViewsRes.rows[0].count),
      topTrailers: topTrailersRes.rows,
      dailyUsers: dailyUsersRes.rows,
      dailyTrailerViews: dailyTrailerViewsRes.rows,
    });
  } catch (err) {
    console.error("Failed to fetch stats:", err);
    res.status(500).json({ error: "Failed to get stats" });
  }
};

// 1) Top Performing Shows (movies + series)
exports.getTopPerformingShows = async (req, res) => {
  try {
    const sql = `
      SELECT m.title AS name, 'Movie' AS type, COUNT(*) AS views
      FROM view_events ve
      JOIN movies m    ON ve.movie_id   = m.id
      WHERE ve.event_type = 'trailer_click'
      GROUP BY m.title

      UNION ALL

      SELECT s.name  AS name, 'Series' AS type, COUNT(*) AS views
      FROM view_events ve
      JOIN tv_shows s ON ve.tv_show_id = s.id
      WHERE ve.event_type = 'trailer_click'
      GROUP BY s.name

      ORDER BY views DESC
      LIMIT 10;
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching top shows:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 2) Monthly User Growth (last 30 days)
exports.getMonthlyUserGrowth = async (req, res) => {
  try {
    const sql = `
      SELECT DATE(created_at) AS date, COUNT(*) AS count
      FROM users
      WHERE created_at >= NOW() - INTERVAL '30 days'
      GROUP BY DATE(created_at)
      ORDER BY date;
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching monthly growth:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// 3) Weekly Activity Heatmap
exports.getHeatmapData = async (req, res) => {
  try {
    const sql = `
      SELECT
        TRIM(TO_CHAR(viewed_at, 'Day')) AS day,
        CASE
          WHEN EXTRACT(HOUR FROM viewed_at) BETWEEN 6  AND 11 THEN 'Morning'
          WHEN EXTRACT(HOUR FROM viewed_at) BETWEEN 12 AND 17 THEN 'Afternoon'
          WHEN EXTRACT(HOUR FROM viewed_at) BETWEEN 18 AND 23 THEN 'Evening'
          ELSE 'Night'
        END AS period,
        COUNT(*) AS count
      FROM view_events
      GROUP BY day, period
      ORDER BY
        CASE day
          WHEN 'Monday'    THEN 1 WHEN 'Tuesday'   THEN 2
          WHEN 'Wednesday' THEN 3 WHEN 'Thursday'  THEN 4
          WHEN 'Friday'    THEN 5 WHEN 'Saturday'  THEN 6
          WHEN 'Sunday'    THEN 7
        END,
        CASE period
          WHEN 'Morning'   THEN 1 WHEN 'Afternoon' THEN 2
          WHEN 'Evening'   THEN 3 WHEN 'Night'     THEN 4
        END;
    `;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching heatmap data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};
