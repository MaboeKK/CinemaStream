// backend/routes/watch.js
const express = require("express");
const router = express.Router();
const pool = require('../config/db');

// // Save watch event
// router.post("/", async (req, res) => {
//   try {
//     const { user_id, movie_id } = req.body;

//     if (!user_id || !movie_id) {
//       return res.status(400).json({ error: "Missing user_id or movie_id" });
//     }

//     await pool.query(
//       "INSERT INTO watched_history (user_id, movie_id) VALUES ($1, $2)",
//       [user_id, movie_id]
//     );

//     res.status(201).json({ message: "Watch event saved" });
//   } catch (err) {
//     console.error("Watch insert error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// module.exports = router;

// backend/routes/watch.js


// Save watch event
router.post("/", async (req, res) => {
  try {
    const { user_id, movie_id, series_id, movie_title, series_name } = req.body;

    if (!movie_id && !series_id) {
      return res.status(400).json({ error: "Missing movie_id or series_id" });
    }

    let query = "";
    let params = [];

    if (movie_id && user_id && movie_title) {
      query = "INSERT INTO watched_history (user_id, movie_id, movie_title) VALUES ($1, $2, $3)";
      params = [user_id, movie_id, movie_title];
    } else if (movie_id) {
      query = "INSERT INTO watched_history (movie_id) VALUES ($1)";
      params = [movie_id];
    } else if (series_id && user_id && series_name) {
      query = "INSERT INTO watched_history (user_id, series_id, series_name) VALUES ($1, $2, $3)";
      params = [user_id, series_id, series_name];
    } else if (series_id) {
      query = "INSERT INTO watched_history (series_id) VALUES ($1)";
      params = [series_id];
    }

    await pool.query(query, params);
    res.status(201).json({ message: "Watch event saved" });

  } catch (err) {
    console.error("Watch insert error:", err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;

