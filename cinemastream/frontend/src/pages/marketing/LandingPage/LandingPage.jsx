import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MovieRow from '../../../components/catalog/MovieRow';
import { fetchPopularSeries, fetchPopularMovies } from '../../../api/tmdb';
import './LandingPage.css';

const HERO_ROTATE_MS = 7000;
const MAX_HERO_BACKDROPS = 5;

export default function LandingPage() {
  const navigate = useNavigate();
  const [heroMovies, setHeroMovies] = useState([]);
  const [heroIndex, setHeroIndex] = useState(0);

  // Only the hero's rotating backdrop needs this data in LandingPage itself
  // -- the "Popular Movies" row below fetches its own copy, same as every
  // row on the logged-in Homepage fetches independently rather than
  // sharing a cache.
  useEffect(() => {
    fetchPopularMovies()
      .then((movieData) => setHeroMovies(movieData.slice(0, MAX_HERO_BACKDROPS)))
      .catch((error) => console.error('Error fetching popular movies:', error));
  }, []);

  const backdropMovies = useMemo(() => heroMovies.filter((movie) => movie.backdrop_path), [heroMovies]);

  // Same rotation pattern as the logged-in Hero (components/catalog/Hero.jsx).
  useEffect(() => {
    if (backdropMovies.length < 2) return undefined;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % backdropMovies.length);
    }, HERO_ROTATE_MS);
    return () => clearInterval(interval);
  }, [backdropMovies]);

  // There's nothing to actually watch without an account, so every card
  // on this page leads to registration rather than a trailer.
  const goToRegister = () => navigate('/register');

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
      <header className="landing-hero">
        {backdropMovies.map((movie, i) => (
          <div
            key={movie.id}
            className={`landing-hero-bg${i === heroIndex ? ' active' : ''}`}
            style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})` }}
          />
        ))}
        <div className="landing-hero-scrim" />
        <div className="landing-hero-content">
          <h1>Get access to the best movies and TV shows</h1>
          <p>Stream your favourite shows to your heart&apos;s content.</p>
          <p>Ready to enjoy? Click register and join us now.</p>
          <Link to="/register" className="btn-primary landing-hero-cta">
            GET STARTED
          </Link>
        </div>

        {backdropMovies.length > 1 && (
          <div className="landing-hero-dots">
            {backdropMovies.map((movie, i) => (
              <button
                key={movie.id}
                className={`landing-hero-dot${i === heroIndex ? ' active' : ''}`}
                aria-label={`Show background ${i + 1}`}
                onClick={() => setHeroIndex(i)}
              />
            ))}
          </div>
        )}
      </header>

      <main className="landing-main">
        {/* Popular rows -- same MovieRow component the logged-in Homepage
            uses, so browsing here looks and scrolls exactly like it does
            past the sign-up wall instead of a bespoke wrapping grid. */}
        <div className="landing-rows">
          <MovieRow title="Popular Movies" fetchFunction={fetchPopularMovies} onMovieClick={goToRegister} accent />
          <MovieRow title="Popular Series" fetchFunction={fetchPopularSeries} onMovieClick={goToRegister} />
        </div>

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
