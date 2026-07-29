import React from 'react';
import './GenreFilter.css';

function GenreFilter({ genres, selectedGenre, onChange, label = 'Genre', id = 'genre-select' }) {
  return (
    <div className="catalog-genre-filter">
      <label htmlFor={id}>{label}:</label>
      <select id={id} value={selectedGenre} onChange={onChange}>
        <option value="">Select Genre</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export default GenreFilter;
