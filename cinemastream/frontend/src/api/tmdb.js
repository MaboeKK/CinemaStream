// src/api/tmdb.js
const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

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

//fetch dicover moview\\

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
// Fetch genres for TV Series
export async function fetchSeriesGenres() {
  const res = await fetch(`${BASE_URL}/genre/tv/list?api_key=${API_KEY}&language=en-US`);
  const data = await res.json();
  return data.genres; // [{ id, name }]
}
// Example fetchMovieDetails
export async function fetchMovieDetails(movieId) {
  const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=YOUR_API_KEY&append_to_response=credits`);
  const data = await response.json();

  return {
    name: data.title,
    overview: data.overview,
    genres: data.genres,
    actors: data.credits?.cast || [],
  };
}

// Example fetchSeriesDetails
export async function fetchSeriesDetails(seriesId) {
  const response = await fetch(`https://api.themoviedb.org/3/tv/${seriesId}?api_key=YOUR_API_KEY&append_to_response=credits`);
  const data = await response.json();

  return {
    name: data.name,
    overview: data.overview,
    genres: data.genres,
    actors: data.credits?.cast || [],
  };
}
