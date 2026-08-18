import React from 'react';
import { NavLink } from 'react-router-dom';
import SearchInput from './SearchInput';
import NotificationsBell from './NotificationsBell';
import ProfileMenu from './ProfileMenu';
import './CatalogNavbar.css';

const navItemClass = ({ isActive }) => `catalog-navbar-item${isActive ? ' active' : ''}`;

// showSearch: false on /movies and /series, which already have their own
// page-level search bar tied to the genre filter and results grid --
// showing this nav search there too meant two independent, differently-
// behaved ways to search the same content on one page.
function CatalogNavbar({ showSearch = true }) {
  return (
    <nav className="catalog-navbar">
      <div className="catalog-navbar-logo">
        <span className="highlight">Cinema</span>Stream
      </div>

      <div className="catalog-navbar-items">
        <NavLink to="/Homepage" className={navItemClass}>
          Home
        </NavLink>
        <NavLink to="/movies" className={navItemClass}>
          Movies
        </NavLink>
        <NavLink to="/series" className={navItemClass}>
          Series
        </NavLink>
        <NavLink to="/my-list" className={navItemClass}>
          My List
        </NavLink>
      </div>

      <div className="catalog-navbar-actions">
        {showSearch && <SearchInput />}
        <NotificationsBell />
        <ProfileMenu />
      </div>
    </nav>
  );
}

export default CatalogNavbar;
