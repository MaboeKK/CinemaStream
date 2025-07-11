import React, { useEffect, useState } from "react";
import Navbar from "../../Components/NavBar/Navbar";
import TrailerModal from "../../Components/Modal/TrailerModal";
import { fetchGenres } from "../../api/tmdb";
import { fetchYoutubeTrailer } from "../../api/youtube";
import Search from "../../Components/SearchBar/Search";
import GenreFilter from "../../Components/GenreFilter/Filter";
import "./Movies.css";

function Movies() {
  const [movieList, setMovieList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({
    name: "",
    overview: "",
    genres: [],
    actors: [],
  });

  useEffect(() => {
    fetchGenres().then(setGenres);
  }, []);

  useEffect(() => {
    setMovieList([]);
    setPage(1);
    loadMovies(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, searchTerm]);

  useEffect(() => {
    if (page > 1) loadMovies();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadMovies = async (reset = false) => {
    setLoading(true);
    try {
      let url = "";

      if (searchTerm.trim()) {
        url = `https://api.themoviedb.org/3/search/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=${page}&query=${encodeURIComponent(searchTerm)}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/movie?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=${page}${
          selectedGenre ? `&with_genres=${selectedGenre}` : ""
        }`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setMovieList((prev) => (reset ? data.results : [...prev, ...data.results]));
    } catch (err) {
      console.error("Failed to load movies", err);
    }
    setLoading(false);
  };

  const openTrailerModal = async (movie, type = "movie") => {
    try {
      const detailsUrl = `https://api.themoviedb.org/3/${type}/${movie.id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&append_to_response=credits`;
      const res = await fetch(detailsUrl);
      const details = await res.json();

      const title = details.title || details.name || "";
      const url = await fetchYoutubeTrailer(title);

      setTrailerUrl(url);
      setModalContent({
        name: title,
        overview: details.overview,
        genres: details.genres,
        actors: details.credits?.cast?.slice(0, 5) || [],
        rawItem: { ...movie, media_type: "movie" },
      });
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to load movie details", error);
      alert("Failed to load movie details.");
    }
  };

  return (
    <div className="movies-page">
      <Navbar />
      <div className="movies-content">
        <div className="filter-bar">
          <h2 className="page-title">Movies</h2>

          <Search
            searchTerm={searchTerm}
            onSearch={(term) => {
              setSearchTerm(term);
              setPage(1);
              setMovieList([]);
            }}
          />

          <GenreFilter
            genres={genres}
            selectedGenre={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            id="movie-genre-select"
            label="Genre"
          />
        </div>

        <div className="series-grid">
          {movieList.map((movie) => (
            <div
              key={movie.id}
              className="series-card"
              onClick={() => openTrailerModal(movie, "movie")}
              style={{ cursor: "pointer" }}
            >
              <img
                className="series-poster"
                src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="series-info">
                <h3 className="series-title">{movie.title}</h3>
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
        modalContent={modalContent}
        onClose={() => {
          setModalOpen(false);
          setTrailerUrl(null);
          setModalContent({ name: "", overview: "", genres: [], actors: [] });
        }}
      />
    </div>
  );
}

export default Movies;
