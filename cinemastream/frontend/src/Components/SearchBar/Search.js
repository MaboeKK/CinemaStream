import React from "react";



function Search({ searchTerm, onSearch }) {
  return (
    <div className="search-bar">
      <input
        type="text"
        placeholder="Search movies by name..."
        value={searchTerm}
        onChange={(e) => onSearch(e.target.value)}
        style={{ width: "100%", padding: "8px", fontSize: "16px" }}
      />
    </div>
  );
}

export default Search;
