import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MovieCard from '../../../components/catalog/MovieCard';
import { fetchPopularSeries, fetchPopularMovies } from '../../../api/tmdb';
import './LandingPage.css';

function MovieGridSkeleton() {
  return (
    <div className="landing-grid">
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="skeleton landing-card-skeleton" />
      ))}
    </div>
  );
}

export default function LandingPage() {
  const navigate = useNavigate();
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

  // There's nothing to actually watch without an account, so every card
  // on this page leads to registration rather than a trailer.
  const goToRegister = () => navigate('/register');

  const backdropMovie = popularMovies.find((movie) => movie.backdrop_path);

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

      {/* Hero */}
      <header
        className="landing-hero"
        style={
          backdropMovie
            ? { backgroundImage: `url(https://image.tmdb.org/t/p/original${backdropMovie.backdrop_path})` }
            : undefined
        }
      >
        <div className="landing-hero-scrim" />
        <div className="landing-hero-content">
          <h1>Get access to the best movies and TV shows</h1>
          <p>Stream your favourite shows to your heart&apos;s content.</p>
          <p>Ready to enjoy? Click register and join us now.</p>
          <Link to="/register" className="btn-primary landing-hero-cta">
            GET STARTED
          </Link>
        </div>
      </header>

      <main className="main-content">
        {/* Popular Movies */}
        <h2>Popular Movies</h2>
        {moviesLoading ? (
          <MovieGridSkeleton />
        ) : (
          <div className="landing-grid">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={{ ...movie, media_type: 'movie' }} onClick={goToRegister} />
            ))}
          </div>
        )}

        {/* Popular Series */}
        <h2>Popular Series</h2>
        {seriesLoading ? (
          <MovieGridSkeleton />
        ) : (
          <div className="landing-grid">
            {popularSeries.map((series) => (
              <MovieCard key={series.id} movie={{ ...series, media_type: 'tv' }} onClick={goToRegister} />
            ))}
          </div>
        )}

        <div className="landing-secondary-cta">
          <h2>Ready to start watching?</h2>
          <Link to="/register" className="btn-primary">
            GET STARTED
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="footer">&copy; 2025 CinemaStream. All rights reserved.</footer>
    </div>
  );
}
