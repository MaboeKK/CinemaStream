import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchPopularSeries, fetchPopularMovies } from '../../../api/tmdb';
import './LandingPage.css';

function MovieGridSkeleton() {
  return (
    <div className="movie-grid">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton movie-card-skeleton" />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const [popularMovies, setPopularMovies] = useState([]);
  const [popularSeries, setPopularSeries] = useState([]);
  const [moviesLoading, setMoviesLoading] = useState(true);
  const [seriesLoading, setSeriesLoading] = useState(true);

  // Fetch popular movies
  useEffect(() => {
    fetchPopularMovies()
      .then((movieData) => setPopularMovies(movieData.slice(0, 5)))
      .catch((error) => console.error('Error fetching popular movies:', error))
      .finally(() => setMoviesLoading(false));
  }, []);

  // Fetch popular series
  useEffect(() => {
    fetchPopularSeries()
      .then((seriesData) => setPopularSeries(seriesData.slice(0, 5)))
      .catch((error) => console.error('Error fetching popular series:', error))
      .finally(() => setSeriesLoading(false));
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
              <Link to="/register" className="btn-primary">
                GET STARTED
              </Link>
            </li>
          </ul>
        </div>

        {/* Popular Movies */}
        <h2>Popular Movies</h2>
        {moviesLoading ? (
          <MovieGridSkeleton />
        ) : (
          <div className="movie-grid">
            {popularMovies.map((movie) => (
              <div className="movie-card" key={movie.id}>
                <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} alt={movie.title} />
                <div className="movie-info">
                  <h3>{movie.title}</h3>
                  <p>{movie.overview}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Popular Series */}
        <h2>Popular Series</h2>
        {seriesLoading ? (
          <MovieGridSkeleton />
        ) : (
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
        )}
      </main>

      {/* Footer */}
      <footer className="footer">&copy; 2025 CinemaStream. All rights reserved.</footer>
    </div>
  );
}
