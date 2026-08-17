// src/api/tmdb.js
import httpClient from './httpClient';

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

// Admin-curated overrides (feature/block a title by TMDB id) -- fetched
// once per page load and cached in memory, since they change rarely and
// every catalog-facing function below needs to consult the block list.
let overridesPromise = null;
function getOverrides() {
  if (!overridesPromise) {
    overridesPromise = httpClient
      .get('/content/overrides')
      .then((r) => r.data.data)
      .catch(() => []); // no overrides yet / not logged in -- fail open, don't block the catalog
  }
  return overridesPromise;
}

async function filterBlocked(items, mediaType) {
  const overrides = await getOverrides();
  const blocked = new Set(
    overrides.filter((o) => o.status === 'blocked').map((o) => `${o.media_type}:${o.tmdb_id}`)
  );
  if (blocked.size === 0) return items;
  return items.filter((item) => !blocked.has(`${item.media_type || mediaType}:${item.id}`));
}

export async function fetchFeaturedTitles() {
  const overrides = await getOverrides();
  const featured = overrides.filter((o) => o.status === 'featured');
  const hydrated = await Promise.all(
    featured.map(async (o) => {
      try {
        const details = o.media_type === 'movie' ? await fetchMovieDetails(o.tmdb_id) : await fetchSeriesDetails(o.tmdb_id);
        return { ...details, media_type: o.media_type };
      } catch {
        return null;
      }
    })
  );
  return hydrated.filter(Boolean);
}

// To fetch trending mocies/series
export async function fetchTrending() {
  const data = await tmdbFetch('/trending/all/day');
  return filterBlocked(data.results);
}

export async function fetchTrendingMovies() {
  const data = await tmdbFetch('/trending/movie/day');
  return filterBlocked(data.results.map((m) => ({ ...m, media_type: 'movie' })), 'movie');
}

export async function fetchTrendingSeries() {
  const data = await tmdbFetch('/trending/tv/day');
  return filterBlocked(data.results.map((s) => ({ ...s, media_type: 'tv' })), 'tv');
}

export async function fetchPopularSeries() {
  const data = await tmdbFetch('/tv/popular', { language: 'en-US', page: 1 });
  return filterBlocked(data.results, 'tv');
}

// To fetch popular movies
export async function fetchPopularMovies() {
  const data = await tmdbFetch('/movie/popular', { language: 'en-US', page: 1 });
  return filterBlocked(data.results, 'movie');
}

export async function fetchDiscoverMovie() {
  const data = await tmdbFetch('/discover/movie');
  return filterBlocked(data.results, 'movie');
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
  return filterBlocked(data.results, 'movie');
}

export async function fetchNewReleaseMovies() {
  const data = await tmdbFetch('/movie/now_playing', { language: 'en-US', page: 1 });
  return filterBlocked(data.results, 'movie');
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
  return filterBlocked(data.results, 'movie');
}

export async function discoverMovies(genreId, page = 1) {
  const data = await tmdbFetch('/discover/movie', {
    language: 'en-US',
    page,
    ...(genreId ? { with_genres: genreId } : {}),
  });
  return filterBlocked(data.results, 'movie');
}

export async function searchSeries(query, page = 1) {
  const data = await tmdbFetch('/search/tv', { language: 'en-US', page, query });
  return filterBlocked(data.results, 'tv');
}

export async function discoverSeries(genreId, page = 1) {
  const data = await tmdbFetch('/discover/tv', {
    language: 'en-US',
    page,
    ...(genreId ? { with_genres: genreId } : {}),
  });
  return filterBlocked(data.results, 'tv');
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
