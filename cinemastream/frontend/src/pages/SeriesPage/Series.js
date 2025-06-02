import React, { useEffect, useState } from "react";
import Navbar from "../../Components/NavBar/Navbar";
import TrailerModal from "../../Components/Modal/TrailerModal";
import { fetchSeriesGenres } from "../../api/tmdb";
import { fetchYoutubeTrailer } from "../../api/youtube";
import "./Series.css";

function Series() {
  const [seriesList, setSeriesList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState("");
  const [page, setPage] = useState(1);

  const [trailerUrl, setTrailerUrl] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const loadSeries = async (reset = false) => {
    try {
      const url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=${page}&with_genres=${selectedGenre}`;
      const res = await fetch(url);
      const data = await res.json();
      setSeriesList((prev) => (reset ? data.results : [...prev, ...data.results]));
    } catch (err) {
      console.error("Failed to load series", err);
    }
  };

  useEffect(() => {
    fetchSeriesGenres().then(setGenres);
  }, []);

  useEffect(() => {
    setSeriesList([]);
    setPage(1);
    loadSeries(true); // reset on genre change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre]);

  useEffect(() => {
    loadSeries(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const openTrailerModal = async (show) => {
    const url = await fetchYoutubeTrailer(show.name);
    if (url) {
      setTrailerUrl(url);
      setModalOpen(true);
    } else {
      alert("Trailer not found!");
    }
  };

  return (
    <div className="series-page">
      <Navbar />
      <div className="series-content">
        <h2 className="page-title">All Series</h2>

        <div className="genre-filter">
          <label htmlFor="series-genre-select" style={{ marginRight: "10px", fontWeight: "bold" }}>
            Filter by Genre:
          </label>
          <select
            id="series-genre-select"
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

        <div className="series-grid">
          {seriesList.map((show) => (
            <div
              key={show.id}
              className="series-card"
              onClick={() => openTrailerModal(show)}
              style={{ cursor: "pointer" }}
            >
              <img
                className="series-poster"
                src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                alt={show.name}
              />
              <div className="series-info">
                <h3 className="series-title">{show.name}</h3>
                <p className="series-overview">{show.overview.slice(0, 80)}...</p>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination Buttons */}
        <div className="pagination">
          {[...Array(10).keys()].map((n) => (
            <button
              key={n + 1}
              className={`page-number ${page === n + 1 ? "active" : ""}`}
              onClick={() => {
                setPage(n + 1);
                setSeriesList([]);
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
            >
              {n + 1}
            </button>
          ))}
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

export default Series;


