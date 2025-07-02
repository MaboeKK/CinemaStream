const pool = require("../config/db");

//dashboard summary
exports.getStats = async (req, res) => {
  try {
    const totalUsersRes      = await pool.query("SELECT COUNT(*) FROM users");
    const totalViewsRes      = await pool.query("SELECT COUNT(*) FROM watched_history");
    const topTrailersRes     = await pool.query(`
      SELECT m.title, COUNT(*) AS views
      FROM watched_history v
      JOIN movies m ON v.movie_id = m.id
      WHERE v.trailer_watched = true
      GROUP BY m.title
      ORDER BY views DESC
      LIMIT 1
    `);
    const dailyTrailerViewsRes = await pool.query(`
      SELECT DATE(watched_at) AS date, COUNT(*) AS count
      FROM watched_history
      WHERE trailer_watched = true
        AND watched_at > NOW() - INTERVAL '7 days'
      GROUP BY DATE(watched_at)
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

// Most Watched Trailers (movies + series)
exports.getTopPerformingShows = async (req, res) => {
  try {
    const sql = `
      SELECT 
        name,
        type,
        SUM(views) AS total_views
      FROM (
        SELECT 
          COALESCE(wh.movie_title, wh.series_name) AS name, 
          CASE 
            WHEN wh.movie_id IS NOT NULL THEN 'Movie'
            WHEN wh.series_id IS NOT NULL THEN 'Series'
          END AS type,
          COUNT(*) AS views
        FROM 
          watched_history wh
        GROUP BY 
          COALESCE(wh.movie_title, wh.series_name),
          CASE 
            WHEN wh.movie_id IS NOT NULL THEN 'Movie'
            WHEN wh.series_id IS NOT NULL THEN 'Series'
          END
      ) AS combined_views
      GROUP BY 
        name,
        type
      ORDER BY 
        total_views DESC
      LIMIT 10;
    `;

    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching top trailers:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Monthly User Growth
exports.getMonthlyUserGrowth = async (req, res) => {
  try {
    const sql = `
      WITH month_series AS (
    SELECT 
        DATE_TRUNC('month', NOW() - INTERVAL '1 month' * (n - 1)) AS month
    FROM 
        generate_series(1, 12) AS n
)
SELECT 
    ms.month, 
    COALESCE(COUNT(u.created_at), 0) AS count
FROM 
    month_series ms
LEFT JOIN 
    users u ON DATE_TRUNC('month', u.created_at) = ms.month
GROUP BY 
    ms.month
ORDER BY 
    ms.month;
    `;
    const { rows } = await pool.query(sql);

    // Format the response to include month names
    const formattedRows = rows.map(row => ({
      date: row.month.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      count: row.count
    }));

    res.json(formattedRows);
  } catch (err) {
    console.error("Error fetching monthly growth:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};


// Weekly Activity Heatmap
exports.getHeatmapData = async (req, res) => {
  try {
    const sql = `
   WITH time_buckets AS (
  SELECT
    TO_CHAR(watched_at, 'FMDay') AS day,
    CASE
      WHEN EXTRACT(HOUR FROM watched_at) BETWEEN 6  AND 11 THEN 'Morning'
      WHEN EXTRACT(HOUR FROM watched_at) BETWEEN 12 AND 17 THEN 'Afternoon'
      WHEN EXTRACT(HOUR FROM watched_at) BETWEEN 18 AND 23 THEN 'Evening'
      ELSE 'Night'
    END AS period
  FROM watched_history
)

SELECT
  day,
  period,
  COUNT(*) AS count
FROM time_buckets
GROUP BY day, period
ORDER BY
  CASE day
    WHEN 'Monday'    THEN 1
    WHEN 'Tuesday'   THEN 2
    WHEN 'Wednesday' THEN 3
    WHEN 'Thursday'  THEN 4
    WHEN 'Friday'    THEN 5
    WHEN 'Saturday'  THEN 6
    WHEN 'Sunday'    THEN 7
  END,
  CASE period
    WHEN 'Morning'   THEN 1
    WHEN 'Afternoon' THEN 2
    WHEN 'Evening'   THEN 3
    WHEN 'Night'     THEN 4
  END;
`;
    const { rows } = await pool.query(sql);
    res.json(rows);
  } catch (err) {
    console.error("Error fetching heatmap data:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};