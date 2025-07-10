import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';

import { fetchPopularSeries, fetchPopularMovies } from "../../api/tmdb";
import "./LandingPage.css";

export default function LandingPage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const navigate = useNavigate();

  // Fetch popular movies
  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await fetchPopularMovies();
        if (movieData.length > 0) {
          setPopularMovies(movieData.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching popular movies:", error);
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
          setPopularSeries(seriesData.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching popular series:", error);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        {/* Logo on the left */}
        <div className="navbar-logo">
          <span className="highlight">Cinema</span>Stream
        </div>

        <ul className="nav-links">
          <li>
            <Link to="/login">Sign In</Link>
          </li>
          <li>
            <Link to="/register">Register</Link>
          </li>
        </ul>
      </nav>

      {/* Getting-started Content */}
      <main className="main-content">
        <div className="getting-started">
          <h2>Get access to the best movies and TV shows</h2>
          <p>Stream your favourite shows to your heart&apos;s content.</p>
          <p>Ready to enjoy? Click register and join us now.</p>
          <ul className="main-link">
            <li>
              <a href="/register" className="active">
                GET STARTED
              </a>
            </li>
          </ul>
        </div>

        {/* Popular Movies */}
        <h2>Popular Movies</h2>
        <div className="landing-movie-grid">
          {popularMovies.map((movie) => (
            <div className="landing-movie-card" key={movie.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
              />
              <div className="landing-movie-info">
                <h3>{movie.title}</h3>
                <p>{movie.overview}</p>
                <button
                  className="watch-trailer-button"
                  onClick={() => navigate("/register")}
                >
                  Watch Trailer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Series */}
        <h2>Popular Series</h2>
        <div className="landing-movie-grid">
          {popularSeries.map((series) => (
            <div className="landing-movie-card" key={series.id}>
              <img
                src={`https://image.tmdb.org/t/p/w500${series.poster_path}`}
                alt={series.name || series.title}
              />
              <div className="landing-movie-info">
                <h3>{series.name || series.title}</h3>
                <p>{series.overview}</p>
                <button
                  className="watch-trailer-button"
                  onClick={() => navigate("/register")}
                >
                  Watch Trailer
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">
        &copy; 2025 CinemaStream. All rights reserved.
      </footer>
    </div>
  );
}
