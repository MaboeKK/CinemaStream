import React from 'react';
import { Link } from 'react-router-dom';
import './Navbar.css';

function Navbar() {
  return (
    <nav className="navbar">
      {/* Logo on the left */}
      <div className="navbar-logo">
        <span className="highlight">Cinema</span>Stream
      </div>

      {/* Navigation links on the right */}
      <div className="navbar-items">
        <Link to="/Homepage" className="navbar-item">Home</Link>
        <Link to="/movies" className="navbar-item">Movies</Link>
        <Link to="/series" className="navbar-item">Series</Link>
        <Link to="/logout" className="navbar-item">Logout</Link>
      </div>
    </nav>
  );
}

export default Navbar;
