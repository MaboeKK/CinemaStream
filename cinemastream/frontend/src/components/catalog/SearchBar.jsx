import React from 'react';

function SearchBar({ searchTerm, onSearch, placeholder = 'Search by name...' }) {
  return (
    <div className="catalog-search-bar">
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
