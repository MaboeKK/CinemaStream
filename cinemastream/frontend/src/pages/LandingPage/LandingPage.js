import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { fetchPopularSeries, fetchPopularMovies } from "../../api/tmdb";
import "./LandingPage.css";

export default function LandingPage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);

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
      }
    };
    fetchData();
  }, []);

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <h1 className="logo">CinemaStream</h1>
        <ul className="nav-links">
          <li><Link to="/login">Sign In</Link></li>
          <li><Link to="/register">Register</Link></li>
        </ul>
      </nav>

      {/* Getting-started Content */}
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
