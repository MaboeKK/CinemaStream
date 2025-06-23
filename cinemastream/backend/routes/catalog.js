/* // routes/catalogRoutes.js
const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');

// GET /api/catalog/movies
router.get('/movies', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT movie_id, title, release_date, poster_url, youtube_video_id
     FROM movies ORDER BY popularity DESC NULLS LAST LIMIT 10`
  );
  res.json(rows);
});

// GET /api/catalog/series
router.get('/series', async (req, res) => {
  const { rows } = await pool.query(
    `SELECT series_id, name AS title, first_air_date AS release_date, poster_url, youtube_video_id
     FROM series ORDER BY popularity DESC NULLS LAST LIMIT 20`
  );
  res.json(rows);
});

module.exports = router;
 */
const express = require('express');
const router  = express.Router();
const pool    = require('../config/db');
 
// GET /api/catalog/movies
router.get('/movies', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT movie_id AS id, title, release_date, poster_url AS poster_path, youtube_video_id
       FROM movies ORDER BY popularity DESC NULLS LAST LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching movies:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
 
// GET /api/catalog/series
router.get('/series', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT series_id AS id, name AS title, first_air_date AS release_date, poster_url AS poster_path, youtube_video_id
       FROM series ORDER BY popularity DESC NULLS LAST LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching series:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
 
module.exports = router;