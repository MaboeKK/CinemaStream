import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPopularSeries, fetchTrending, fetchPopularMovies } from "../api/tmdb";
import { fetchYoutubeTrailer } from "../api/youtube"; 
import TrailerModal from "../components/TrailerModal"; 
import "./LandingPage.css";

export default function LandingPage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [latestMovies, setLatestMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]); // fixed
  const [loading, setLoading] = useState(true);
  const [selectedTrailer, setSelectedTrailer] = useState(null); // for modal

  // Fetch trending
  useEffect(() => {
    const fetchData = async () => {
      try {
        const trendingData = await fetchTrending();
        if (trendingData.length > 0) {
          setLatestMovies(trendingData.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching trending movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch popular movies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await fetchPopularMovies();
        if (movieData.length > 0) {
          setPopularMovies(movieData.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Fetch popular series
  useEffect(() => {
    const fetchData = async () => {
      try {
        const seriesData = await fetchPopularSeries();
        if (seriesData.length > 0) {
          setPopularSeries(seriesData.slice(0, 5));
        }
      } catch (error) {
        console.error("Error fetching popular series:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleWatchTrailer = async (title) => {
    const trailerUrl = await fetchYoutubeTrailer(title);
    setSelectedTrailer(trailerUrl);
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <h1 className="logo">CinemaStream</h1>
        <ul className="nav-links">
          <li><Link to="/login">Sign In</Link></li>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/About">About Us</Link></li>
        </ul>
      </nav>

      {/* Hero Content */}
      <main className="main-content">
        <div className="getting-started">
          <h2>Get access to the best movies and TV shows</h2>
          <p>Stream your favourite shows to your heart's content.</p>
          <p>Ready to enjoy? Click register and join us now.</p>
          <ul className="main-link">
            <li>
              <a href="/register" className="active">GET STARTED</a>
            </li>
          </ul>
        </div>

        {/* Popular Movies */}
        <h2>Popular Movies</h2>
        <div className="movie-grid">
          {popularMovies.map((movie) => (
            <div className="movie-card" key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
                <button className="watch-now" onClick={() => handleWatchTrailer(movie.title)}>
                  Watch Trailer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Series */}
        <h2>Popular Series</h2>
        <div className="movie-grid">
          {popularSeries.map((series) => (
            <div className="movie-card" key={series.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name || series.title}
              />
              <div className="movie-info">
                <h3>{series.name || series.title}</h3>
                <p>{series.overview}</p>
                <button className="watch-now" onClick={() => handleWatchTrailer(series.name || series.title)}>
                  Watch Trailer
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Trailer Modal */}
      <TrailerModal trailerUrl={selectedTrailer} onClose={() => setSelectedTrailer(null)} />

      {/* Footer */}
      <footer className="footer">
        &copy; 2025 CinemaStream. All rights reserved.
      </footer>
    </div>
  );
}
