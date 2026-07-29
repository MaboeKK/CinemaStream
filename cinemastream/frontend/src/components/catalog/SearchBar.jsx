import React from 'react';
import { FaSearch } from 'react-icons/fa';

function SearchBar({ searchTerm, onSearch, placeholder = 'Search by name...' }) {
  return (
    <div className="catalog-search-bar">
      <FaSearch className="catalog-search-bar-icon" />
      <input
        type="text"
        placeholder={placeholder}
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        className="catalog-search-input"
      />
    </div>
  );
}

export default SearchBar;
