import React, { useEffect, useState } from "react";
import Navbar from "../../Components/NavBar/Navbar";
import TrailerModal from "../../Components/Modal/TrailerModal";
import { fetchGenres } from "../../api/tmdb";
import { fetchYoutubeTrailer } from "../../api/youtube";
import "./Movies.css";

function Movies() {
  const [movies, setMovies] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  // Trailer modal state
  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadMovies = async (reset = false) => {
    setLoading(true);
    try {
      const url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=${page}&with_genres=${selectedGenre}`;
      const res = await fetch(url);
      const data = await res.json();
      setMovies((prev) => (reset ? data.results : [...prev, ...data.results]));
    } catch (err) {
      console.error("Failed to load movies", err);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  useEffect(() => {
    setMovies([]);
    setPage(1);
    loadMovies(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre]);

  useEffect(() => {
    if (page > 1) loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openTrailerModal = async (movie) => {
    const url = await fetchYoutubeTrailer(movie.title || movie.name);
    if (url) {
      setTrailerUrl(url);
      setModalOpen(true);
    } else {
      alert("Trailer not found!");
    }
  };

  return (
    <div className="movies-page">
      <Navbar />
      <div className="movies-content">
        <h2 className="page-title">All Movies</h2>

        <div className="genre-filter">
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>

        <div className="movies-grid">
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="movie-card"
              onClick={() => openTrailerModal(movie)}
            >
              <img
                className="movie-poster"
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-overview">{movie.overview.slice(0, 1000)}...</p>
              </div>
            </div>
          ))}
        </div>

        <div className="load-more">
          <button onClick={() => setPage((p) => p + 1)} disabled={loading}>
            {loading ? "Loading..." : "Load More"}
          </button>
        </div>
      </div>

      <TrailerModal
        isOpen={modalOpen}
        trailerUrl={trailerUrl}
        onClose={() => {
          setModalOpen(false);
          setTrailerUrl(null);
        }}
      />
    </div>
  );
}

export default Movies;
