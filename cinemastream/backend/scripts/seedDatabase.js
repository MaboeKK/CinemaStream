// scripts/seedDatabase.js
require('dotenv').config();
const axios = require('axios');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.POSTGRES_URI,
});

const TMDB_KEY = process.env.REACT_APP_TMDB_API_KEY;
const YT_KEY   = process.env.REACT_APP_YOUTUBE_API_KEY;
const TMDB_BASE = 'https://api.themoviedb.org/3';

//Safely fetch the YouTube trailer ID; return null on error.
async function fetchTrailerId(query) {
  try {
    const res = await axios.get('https://www.googleapis.com/youtube/v3/search', {
      params: {
        key: YT_KEY,
        part: 'snippet',
        q: `${query} official trailer`,
        maxResults: 1,
        type: 'video',
        videoEmbeddable: 'true'
      }
    });
    
    return res.data.items?.[0]?.id?.videoId || null;
  } catch (err) {
    console.warn(`Skipping YouTube for "${query}": ${err.response?.status} ${err.response?.statusText}`);
    return null;
  }
}

// 1) Genres
async function seedGenres() {
  const res = await axios.get(`${TMDB_BASE}/genre/movie/list`, {
    params: { api_key: TMDB_KEY, language: 'en-US' }
  });
  for (let { id: tmdb_id, name } of res.data.genres) {
    await pool.query(
      `INSERT INTO genres (tmdb_id, name)
       VALUES ($1, $2)
       ON CONFLICT (tmdb_id) DO NOTHING`,
      [tmdb_id, name]
    );
    console.log(`Genre: ${name}`);
  }
}

// generic TMDB pagination
async function fetchPages(path, pages = 5) {
  let all = [];
  for (let page = 1; page <= pages; page++) {
    const res = await axios.get(`${TMDB_BASE}/${path}`, {
      params: { api_key: TMDB_KEY, language: 'en-US', page }
    });
    console.log(`Fetched ${path} page ${page}`);
    all = all.concat(res.data.results);
  }
  return all;
}

// 2) Movies + movie_genres
async function seedMovies() {
  const movies = await fetchPages('movie/popular', 5);
  for (let m of movies) {
    const poster = m.poster_path
      ? `https://image.tmdb.org/t/p/original${m.poster_path}`
      : null;
    const trailer = await fetchTrailerId(m.title);
   // const videoId = trailer?.items?.[0]?.id?.videoId || null;
    

    // upsert movie and get its PK
    const upsertResult = await pool.query(
      `INSERT INTO movies (tmdb_id, title, release_date, poster_url, youtube_video_id)
       VALUES ($1,$2,$3,$4,$5)
       ON CONFLICT (tmdb_id) DO UPDATE
         SET youtube_video_id = EXCLUDED.youtube_video_id
       RETURNING movie_id`,
      [m.id, m.title, m.release_date, poster, trailer]
    );
    const internalMovieId = upsertResult.rows[0].movie_id;
    console.log(`Movie: ${m.title} (movie_id=${internalMovieId})`);

    // link genres
    for (let gid of m.genre_ids) {
      const g = await pool.query(`SELECT id FROM genres WHERE tmdb_id=$1`, [gid]);
      if (g.rows[0]) {
        await pool.query(
          `INSERT INTO movie_genres (movie_id, genre_id)
           VALUES ($1, $2)
           ON CONFLICT DO NOTHING`,
          [internalMovieId, g.rows[0].id]
        );
      }
    }
  }
}

// 3) Series + series_genres
async function seedSeries() {
   const shows = await fetchPages('tv/popular', 5);
   for (let s of shows) {
     const poster = s.poster_path
       ? `https://image.tmdb.org/t/p/original${s.poster_path}`
       : null;
     const trailer = await fetchTrailerId(s.name);

     // upsert Series and get its P
    const up = await pool.query(
      `INSERT INTO series (tmdb_id, name, first_air_date, poster_url, youtube_video_id)
        VALUES ($1,$2,$3,$4,$5)
        ON CONFLICT (tmdb_id) DO UPDATE
          SET youtube_video_id = EXCLUDED.youtube_video_id
      RETURNING series_id`,
      [s.id, s.name, s.first_air_date, poster, trailer]
     );
    const seriesId = up.rows[0].series_id;
    console.log(`Series: ${s.name} (id=${seriesId})`);

     // link genres
     for (let gid of s.genre_ids) {
       const gr = await pool.query(`SELECT id FROM genres WHERE tmdb_id=$1`, [gid]);
       if (gr.rows[0]) {
        await pool.query(
          `INSERT INTO series_genres (series_id, genre_id)
            VALUES ($1, $2)
            ON CONFLICT DO NOTHING`,
          [seriesId, gr.rows[0].id]
         );
       }
     }
   }
}

(async () => {
  try {
    console.log('Seeding Genres...');
    await seedGenres();

    console.log('Seeding Movies...');
    await seedMovies();

    console.log('Seeding Series...');
    await seedSeries();

    console.log('Database seeding complete!');
  } catch (err) {
    console.error('Seeding error:', err);
  } finally {
    await pool.end();
  }
})();
