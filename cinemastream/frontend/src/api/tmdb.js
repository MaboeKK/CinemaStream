// src/api/tmdb.js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// Shared fetch wrapper: builds the query string and throws on a non-2xx
// response, so a bad API key or rate-limit (429) surfaces as a rejected
// promise instead of quietly resolving with `undefined` result fields that
// crash a downstream .map()/.slice() call.
async function tmdbFetch(path, params = {}) {
  const query = new URLSearchParams({ api_key: API_KEY, ...params }).toString();
  const res = await fetch(`${BASE_URL}${path}?${query}`);
  if (!res.ok) {
    throw new Error(`TMDB request failed (${res.status}): ${path}`);
  }
  return res.json();
}

// To fetch trending mocies/series
export async function fetchTrending() {
  const data = await tmdbFetch('/trending/all/day');
  return data.results;
}

export async function fetchPopularSeries() {
  const data = await tmdbFetch('/tv/popular', { language: 'en-US', page: 1 });
  return data.results;
}

// To fetch popular movies
export async function fetchPopularMovies() {
  const data = await tmdbFetch('/movie/popular', { language: 'en-US', page: 1 });
  return data.results;
}

export async function fetchDiscoverMovie() {
  const data = await tmdbFetch('/discover/movie');
  return data.results;
}

export async function fetchGenres() {
  const data = await tmdbFetch('/genre/movie/list', { language: 'en-US' });
  return data.genres; // array of { id, name }
}

export async function fetchSeriesGenres() {
  const data = await tmdbFetch('/genre/tv/list', { language: 'en-US' });
  return data.genres; // [{ id, name }]
}

export async function fetchTopRatedMovies() {
  const data = await tmdbFetch('/movie/top_rated', { language: 'en-US', page: 1 });
  return data.results;
}

export async function fetchNewReleaseMovies() {
  const data = await tmdbFetch('/movie/now_playing', { language: 'en-US', page: 1 });
  return data.results;
}

export async function fetchMovieDetails(movieId) {
  const data = await tmdbFetch(`/movie/${movieId}`, { append_to_response: 'credits' });
  return {
    id: data.id,
    name: data.title,
    overview: data.overview,
    genres: data.genres,
    actors: (data.credits?.cast || []).slice(0, 5),
    poster_path: data.poster_path,
    vote_average: data.vote_average,
    release_date: data.release_date,
    runtime: data.runtime,
  };
}

export async function searchMovies(query, page = 1) {
  const data = await tmdbFetch('/search/movie', { language: 'en-US', page, query });
  return data.results;
}

export async function discoverMovies(genreId, page = 1) {
  const data = await tmdbFetch('/discover/movie', {
    language: 'en-US',
    page,
    ...(genreId ? { with_genres: genreId } : {}),
  });
  return data.results;
}

export async function searchSeries(query, page = 1) {
  const data = await tmdbFetch('/search/tv', { language: 'en-US', page, query });
  return data.results;
}

export async function discoverSeries(genreId, page = 1) {
  const data = await tmdbFetch('/discover/tv', {
    language: 'en-US',
    page,
    ...(genreId ? { with_genres: genreId } : {}),
  });
  return data.results;
}

// Combines discover/movie + discover/tv into one tagged result set for the
// homepage's hybrid genre filter. seriesGenreId omitted (no TV equivalent
// for the genre) intentionally yields zero series, not an unfiltered list.
export async function fetchTitlesByGenre({ movieGenreId, seriesGenreId }) {
  const [movies, series] = await Promise.all([
    discoverMovies(movieGenreId),
    seriesGenreId ? discoverSeries(seriesGenreId) : Promise.resolve([]),
  ]);
  return {
    movies: movies.map((m) => ({ ...m, media_type: 'movie' })),
    series: series.map((s) => ({ ...s, media_type: 'tv' })),
  };
}

export async function fetchSimilarMovies(movieId) {
  const data = await tmdbFetch(`/movie/${movieId}/similar`, { language: 'en-US', page: 1 });
  return data.results;
}

export async function fetchSimilarSeries(seriesId) {
  const data = await tmdbFetch(`/tv/${seriesId}/similar`, { language: 'en-US', page: 1 });
  return data.results;
}

export async function fetchSeriesDetails(seriesId) {
  const data = await tmdbFetch(`/tv/${seriesId}`, { append_to_response: 'credits' });
  return {
    id: data.id,
    name: data.name,
    overview: data.overview,
    genres: data.genres,
    actors: (data.credits?.cast || []).slice(0, 5),
    poster_path: data.poster_path,
    vote_average: data.vote_average,
    release_date: data.first_air_date,
  };
}
