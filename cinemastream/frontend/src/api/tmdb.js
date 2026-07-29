// src/api/tmdb.js
const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

// To fetch trending mocies/series
export async function fetchTrending() {
  const res = await fetch(`${BASE_URL}/trending/all/day?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

export async function fetchPopularSeries() {
  const res = await fetch(`${BASE_URL}/tv/popular?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

// To fetch popular movies
export async function fetchPopularMovies() {
  const res = await fetch(`${BASE_URL}/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function fetchDiscoverMovie() {
  const res = await fetch(`${BASE_URL}/discover/movie?api_key=${API_KEY}`);
  const data = await res.json();
  return data.results;
}

export async function fetchGenres() {
  const res = await fetch(`${BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  return data.genres; // array of { id, name }
}

export async function fetchSeriesGenres() {
  const res = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  return data.genres; // [{ id, name }]
}

export async function fetchTopRatedMovies() {
  const res = await fetch(`${BASE_URL}/movie/top_rated?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function fetchNewReleaseMovies() {
  const res = await fetch(`${BASE_URL}/movie/now_playing?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function fetchMovieDetails(movieId) {
  const res = await fetch(`${BASE_URL}/movie/${movieId}?api_key=${API_KEY}&append_to_response=credits`);
  const data = await res.json();
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
  const res = await fetch(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&language=en-US&page=${page}&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data.results;
}

export async function discoverMovies(genreId, page = 1) {
  const genreParam = genreId ? `&with_genres=${genreId}` : '';
  const res = await fetch(
    `${BASE_URL}/discover/movie?api_key=${API_KEY}&language=en-US&page=${page}${genreParam}`
  );
  const data = await res.json();
  return data.results;
}

export async function searchSeries(query, page = 1) {
  const res = await fetch(
    `${BASE_URL}/search/tv?api_key=${API_KEY}&language=en-US&page=${page}&query=${encodeURIComponent(query)}`
  );
  const data = await res.json();
  return data.results;
}

export async function discoverSeries(genreId, page = 1) {
  const genreParam = genreId ? `&with_genres=${genreId}` : '';
  const res = await fetch(
    `${BASE_URL}/discover/tv?api_key=${API_KEY}&language=en-US&page=${page}${genreParam}`
  );
  const data = await res.json();
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
  const res = await fetch(`${BASE_URL}/movie/${movieId}/similar?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function fetchSimilarSeries(seriesId) {
  const res = await fetch(`${BASE_URL}/tv/${seriesId}/similar?api_key=${API_KEY}&language=en-US&page=1`);
  const data = await res.json();
  return data.results;
}

export async function fetchSeriesDetails(seriesId) {
  const res = await fetch(`${BASE_URL}/tv/${seriesId}?api_key=${API_KEY}&append_to_response=credits`);
  const data = await res.json();
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
