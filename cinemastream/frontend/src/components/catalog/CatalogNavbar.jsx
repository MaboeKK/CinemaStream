import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import './CatalogNavbar.css';

function CatalogNavbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <nav className="catalog-navbar">
      <div className="catalog-navbar-logo">
        <span className="highlight">Cinema</span>Stream
      </div>

      <div className="catalog-navbar-items">
        <Link to="/Homepage" className="catalog-navbar-item">
          Home
        </Link>
        <Link to="/movies" className="catalog-navbar-item">
          Movies
        </Link>
        <Link to="/series" className="catalog-navbar-item">
          Series
        </Link>
        <button className="catalog-navbar-item" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </nav>
  );
}

export default CatalogNavbar;
