import React, { useEffect, useState } from 'react';
import { FaTags } from 'react-icons/fa';
import { fetchGenres, fetchSeriesGenres } from '../../api/tmdb';
import EmptyState from './EmptyState';
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
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    Promise.all([fetchGenres(), fetchSeriesGenres()])
      .then(([movieGenres, tvGenres]) => {
        const tvByName = new Map(tvGenres.map((g) => [g.name, g]));
        const merged = movieGenres
          .filter((g) => FEATURED_GENRE_NAMES.includes(g.name))
          .map((movieGenre) => {
            const tvName = TV_GENRE_SYNONYMS[movieGenre.name] || movieGenre.name;
            const tvGenre = tvByName.get(tvName);
            return {
              name: movieGenre.name,
              movieGenreId: movieGenre.id,
              seriesGenreId: tvGenre?.id,
            };
          });
        setGenres(merged);
      })
      .finally(() => setLoaded(true));
  }, []);

  if (!loaded) return null;

  if (genres.length === 0) {
    return (
      <EmptyState
        compact
        icon={<FaTags />}
        title="No genres available"
        description="We couldn't load genres right now — try refreshing the page."
      />
    );
  }

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
