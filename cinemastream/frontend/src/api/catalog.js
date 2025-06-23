export const fetchPopularMovies = async () => {
  const res = await fetch('/api/catalog/movies');
  if (!res.ok) throw new Error("Failed to fetch movies");
  return await res.json();
};

export const fetchPopularSeries = async () => {
  const res = await fetch('/api/catalog/series');
  if (!res.ok) throw new Error("Failed to fetch series");
  return await res.json();
};

export const fetchMovieDetails = async (movie_id) => {
  const res = await fetch(`/api/catalog/movies/${movie_id}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return await res.json();
};

export const fetchSeriesDetails = async (series_id) => {
  const res = await fetch(`/api/catalog/series/${series_id}`);
  if (!res.ok) throw new Error("Failed to fetch series details");
  return await res.json();
};
