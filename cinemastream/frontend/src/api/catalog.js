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

export const fetchMovieDetails = async (id) => {
  const res = await fetch(`/api/catalog/movies/${id}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return await res.json();
};
export const fetchSeriesDetails = async (id) => {
  const res = await fetch(`/api/catalog/series/${id}`);
  if (!res.ok) throw new Error("Failed to fetch movie details");
  return await res.json();
};

