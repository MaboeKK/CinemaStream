const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const axios = require('axios');

// GET /api/catalog/movies
router.get('/movies', async (req, res) => {
  try {
    const { rows } = await pool.query(
      `SELECT movie_id AS id, title, release_date, poster_url AS poster_path, youtube_video_id
       FROM movies ORDER BY is_popular DESC NULLS LAST LIMIT 10`
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
       FROM series ORDER BY is_popular DESC NULLS LAST LIMIT 10`
    );
    res.json(rows);
  } catch (error) {
    console.error('Error fetching series:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/catalog/movies/:id
router.get('/movies/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT movie_id, title, release_date, poster_url
       FROM movies WHERE movie_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Movie not found' });
    }

    const movie = result.rows[0];

    const ytRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${movie.title} official trailer`,
        maxResults: 1,
        type: 'video',
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
      },
    });

    const youtube_video_id = ytRes.data.items[0]?.id?.videoId || null;

    res.json({
      ...movie,
      youtube_video_id,
    });
  } catch (error) {
    console.error('Error fetching movie details:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /api/catalog/series/:id
router.get('/series/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT series_id, name, first_air_date, poster_url
       FROM series WHERE series_id = $1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Series not found' });
    }

    const series = result.rows[0];

    const ytRes = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        part: 'snippet',
        q: `${series.name} official trailer`,
        maxResults: 1,
        type: 'video',
        key: process.env.REACT_APP_YOUTUBE_API_KEY,
      },
    });

    const youtube_video_id = ytRes.data.items[0]?.id?.videoId || null;

    res.json({
      ...series,
      youtube_video_id,
    });
  } catch (error) {
    console.error('Error fetching series details:', error.response?.data || error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;
