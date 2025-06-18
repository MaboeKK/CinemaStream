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
    fetchSeriesGenres().then(setGenres);
  }, []);

  useEffect(() => {
    setSeriesList([]);
    setPage(1);
    loadSeries(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, searchTerm]);

  useEffect(() => {
    if (page > 1) loadSeries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  const loadSeries = async (reset = false) => {
    setLoading(true);
    try {
      let url = "";

      if (searchTerm.trim()) {
        url = `https://api.themoviedb.org/3/search/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=${page}&query=${encodeURIComponent(searchTerm)}`;
      } else {
        url = `https://api.themoviedb.org/3/discover/tv?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&page=${page}${
          selectedGenre ? `&with_genres=${selectedGenre}` : ""
        }`;
      }

      const res = await fetch(url);
      const data = await res.json();
      setSeriesList((prev) => (reset ? data.results : [...prev, ...data.results]));
    } catch (err) {
      console.error("Failed to load series", err);
    }
    setLoading(false);
  };

  const openTrailerModal = async (show, type = "tv") => {
    try {
      const detailsUrl = `https://api.themoviedb.org/3/${type}/${show.id}?api_key=${process.env.REACT_APP_TMDB_API_KEY}&language=en-US&append_to_response=credits`;
      const res = await fetch(detailsUrl);
      const details = await res.json();

      const title = details.name || details.title || "";

      const url = await fetchYoutubeTrailer(title);

      setTrailerUrl(url);
      setModalContent({
        name: title,
        overview: details.overview,
        genres: details.genres,
        actors: details.credits?.cast?.slice(0, 5) || [],
      });
      setModalOpen(true);
    } catch (error) {
      console.error("Failed to load details", error);
      alert("Failed to load series details.");
    }
  };

  return (
  
    <div className="series-page">
      <Navbar />
      
      <div className="series-content">
      <div className="filter-bar">
        <h2 className="page-title"> Series
       
        </h2>
        
        <div className="search-bar">
          <input
            type="text"
            placeholder="Search series by name..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPage(1);
              setSeriesList([]);
            }}
            style={{ width: "100%", padding: "8px", fontSize: "16px" }}
          />
        </div>

        <div className="genre-filter">
          <label
            htmlFor="series-genre-select"
            style={{ marginRight: "10px", fontWeight: "bold" }}
          >
            Genre:
          </label>
          <select
            id="series-genre-select"
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
          >
            <option value="">Select Genre</option>
            {genres.map((genre) => (
              <option key={genre.id} value={genre.id}>
                {genre.name}
              </option>
            ))}
          </select>
        </div>
</div>
        <div className="series-grid">
          {seriesList.map((show) => (
            <div
              key={show.id}
              className="series-card"
              onClick={() => openTrailerModal(show, "tv")}
              style={{ cursor: "pointer" }}
            >
              <img
                className="series-poster"
                src={`https://image.tmdb.org/t/p/w300${show.poster_path}`}
                alt={show.name}
              />
              <div className="series-info">
                <h3 className="series-title">{show.name}</h3>
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

export default Series;
