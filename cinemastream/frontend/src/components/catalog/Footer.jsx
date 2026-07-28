import React from 'react';
import './Footer.css';

// Links are presentational placeholders -- no About/Privacy/Terms/Contact
// pages exist yet, so they intentionally don't navigate anywhere.
const LINKS = ['About', 'Privacy', 'Terms', 'Contact'];

function Footer() {
  return (
    <footer className="catalog-footer">
      <div className="catalog-footer-links">
        {LINKS.map((label) => (
          <span key={label} className="catalog-footer-link">
            {label}
          </span>
        ))}
      </div>
      <p className="catalog-footer-copyright">&copy; {new Date().getFullYear()} CinemaStream. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
