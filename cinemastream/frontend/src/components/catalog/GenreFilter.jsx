import React from 'react';
import { FaChevronDown } from 'react-icons/fa';
import './GenreFilter.css';

function GenreFilter({ genres, selectedGenre, onChange, label = 'Genre', id = 'genre-select' }) {
  return (
    <div className={`catalog-genre-filter${selectedGenre ? ' active' : ''}`}>
      <select id={id} aria-label={label} value={selectedGenre} onChange={onChange}>
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre.id} value={genre.id}>
            {genre.name}
          </option>
        ))}
      </select>
      <FaChevronDown className="catalog-genre-filter-chevron" aria-hidden="true" />
    </div>
  );
}

export default GenreFilter;
