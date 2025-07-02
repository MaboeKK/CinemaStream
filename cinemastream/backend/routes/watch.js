// backend/routes/watch.js
const express = require("express");
const router = express.Router();
const pool = require('../config/db');

// Save watch event
router.post("/", async (req, res) => {
    try {
      const { user_id, movie_id, series_id, movie_title, series_name } = req.body;
  
      if (!movie_id && !series_id) {
        return res.status(400).json({ error: "Missing movie_id or series_id" });
      }
  
      let query = "";
      let params = [];
  
      if (movie_id) {
        query = `
          INSERT INTO watched_history (user_id, movie_id, movie_title, watched_at)
          VALUES ($1, $2, $3, NOW())
        `;
        params = [user_id || null, movie_id, movie_title || null];
      } else if (series_id) {
        query = `
          INSERT INTO watched_history (user_id, series_id, series_name, watched_at)
          VALUES ($1, $2, $3, NOW())
        `;
        params = [user_id || null, series_id, series_name || null];
      }
  
      await pool.query(query, params);
      res.status(201).json({ message: "Watch event saved" });
  
    } catch (err) {
      console.error("Watch insert error:", err);
      res.status(500).json({ error: "Server error" });
    }
  });
  
  module.exports = router;
