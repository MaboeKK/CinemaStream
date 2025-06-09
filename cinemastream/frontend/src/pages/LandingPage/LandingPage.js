import React, { useEffect, useState } from "react";
import { fetchPopularSeries, fetchPopularMovies } from "../../api/tmdb";
import Register from "../RegisterPage/Register";
import Login from "../LoginPage/Login";
import "./LandingPage.css";

export default function LandingPage() {
  // State to store fetched popular movies
  const [popularMovies, setPopularMovies] = useState([]);
  // State to store fetched popular TV series
  const [popularSeries, setPopularSeries] = useState([]);
  // State to toggle visibility of modals
  const [showRegister, setShowRegister] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);

  // Fetch popular movies from the TMDB API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const movieData = await fetchPopularMovies();
        if (movieData.length > 0) {
          // Show only the top 4 movies
          setPopularMovies(movieData.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching popular movies:", error);
      }
    };
    fetchData();
  }, []);

  // Fetch popular series from the TMDB API on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const seriesData = await fetchPopularSeries();
        if (seriesData.length > 0) {
          // Show only the top 4 series
          setPopularSeries(seriesData.slice(0, 4));
        }
      } catch (error) {
        console.error("Error fetching popular series:", error);
      }
    };
    fetchData();
  }, []);

  // Helper to close all modals at once
  const closeAllModals = () => {
    setShowRegister(false);
    setShowLogin(false);
    setShowForgotPassword(false);
  };

  // Open login modal
  const openLoginModal = () => {
    closeAllModals();
    setShowLogin(true);
  };

  // Open register modal
  const openRegisterModal = () => {
    closeAllModals();
    setShowRegister(true);
  };

  // Open forgot password modal
  const openForgotPasswordModal = () => {
    closeAllModals();
    setShowForgotPassword(true);
  };

  return (
    <div className="landing-page">
      {/* Navigation Bar */}
      <nav className="navbar">
        <div className="navbar-logo">
          <span className="highlight">Cinema</span>Stream
        </div>
        <ul className="nav-links">
          <li>
            <button className="active" onClick={openLoginModal}>
              Sign In
            </button>
          </li>
          <li>
            <button className="active" onClick={openRegisterModal}>
              Register
            </button>
          </li>
        </ul>
      </nav>

      {/* Main Content Area */}
      <main className="main-content">
        {/* Hero Section */}
        <div className="getting-started">
          <h2>Get access to the best movies and TV shows</h2>
          <p>Stream your favourite shows to your heart's content.</p>
          <p>Ready to enjoy? Click register and join us now.</p>
          <ul className="main-link">
            <li>
              <button className="active" onClick={openRegisterModal}>
                GET STARTED
              </button>
            </li>
          </ul>
        </div>

        {/* Popular Movies Section */}
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
                <button
                  className="watch-trailer-button"
                  onClick={openRegisterModal}
                >
                  Watch Trailer
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Popular Series Section */}
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
                <button
                  className="watch-trailer-button"
                  onClick={openRegisterModal}
                >
                  Watch Trailer
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Register Modal */}
      {showRegister && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button onClick={closeAllModals} className="close-btn">
              &times;
            </button>
            <Register
              closeModal={closeAllModals}
              openLoginModal={openLoginModal}
            />
          </div>
        </div>
      )}

      {/* Login Modal */}
      {showLogin && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button onClick={closeAllModals} className="close-btn">
              &times;
            </button>
            <Login
              closeModal={closeAllModals}
              openRegisterModal={openRegisterModal}
              openForgotPasswordModal={openForgotPasswordModal}
            />
          </div>
        </div>
      )}

      {/* Forgot Password Modal */}
      {showForgotPassword && (
        <div className="modal-backdrop">
          <div className="modal-content">
            <button onClick={closeAllModals} className="close-btn">
              &times;
            </button>
            {/* Forgot Password Form (temporary inline version) */}
            <div className="wrapper">
              <div className="form-box">
                <h1>Forgot Password</h1>
                <p>
                  Enter your email address and we'll send you a link to reset your
                  password.
                </p>
                <form>
                  <div className="input-box">
                    <input type="email" placeholder="Email" required />
                  </div>
                  <button type="submit">Send Reset Link</button>
                </form>
                <div className="register-link">
                  <p>
                    Remember your password?{" "}
                    <span
                      className="link"
                      style={{ color: "blue", cursor: "pointer" }}
                      onClick={openLoginModal}
                    >
                      Sign In
                    </span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="footer">
        &copy; 2025 CinemaStream. All rights reserved.
      </footer>
    </div>
  );
}
