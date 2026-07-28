import React, { useEffect, useState } from 'react';
import { fetchGenres, fetchSeriesGenres } from '../../api/tmdb';
import './GenreChips.css';

const FEATURED_GENRE_NAMES = ['Action', 'Comedy', 'Drama', 'Horror', 'Science Fiction'];

// TMDB movie and TV genres are different ID namespaces with different
// names for the same concept -- Horror has no TV equivalent at all, so
// that chip legitimately yields zero TV results rather than being "wrong".
const TV_GENRE_SYNONYMS = {
  Action: 'Action & Adventure',
  'Science Fiction': 'Sci-Fi & Fantasy',
};

function GenreChips({ selected, onSelect }) {
  const [genres, setGenres] = useState([]);

  useEffect(() => {
    Promise.all([fetchGenres(), fetchSeriesGenres()]).then(([movieGenres, tvGenres]) => {
      const merged = movieGenres
        .filter((g) => FEATURED_GENRE_NAMES.includes(g.name))
        .map((movieGenre) => {
          const tvName = TV_GENRE_SYNONYMS[movieGenre.name] || movieGenre.name;
          const tvGenre = tvGenres.find((g) => g.name === tvName);
          return {
            name: movieGenre.name,
            movieGenreId: movieGenre.id,
            seriesGenreId: tvGenre?.id,
          };
        });
      setGenres(merged);
    });
  }, []);

  if (genres.length === 0) return null;

  return (
    <div className="genre-chips">
      <button
        className={`genre-chip${!selected ? ' active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All Genres
      </button>
      {genres.map((genre) => (
        <button
          key={genre.name}
          className={`genre-chip${selected?.name === genre.name ? ' active' : ''}`}
          onClick={() => onSelect(genre)}
        >
          {genre.name}
        </button>
      ))}
    </div>
  );
}

export default GenreChips;
