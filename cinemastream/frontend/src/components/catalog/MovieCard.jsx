import React from 'react';
import { FaPlay, FaPlus, FaCheck } from 'react-icons/fa';
import { useMyList } from '../../hooks/useMyList';
import './MovieCard.css';

function MovieCard({ movie, onClick }) {
  const { isSaved, toggle } = useMyList();
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  const saved = isSaved(movie.id);

  const handleToggleMyList = (e) => {
    e.stopPropagation();
    toggle({ ...movie, media_type: mediaType });
  };

  return (
    <div className="catalog-card" onClick={onClick}>
      <img
        className="catalog-card-poster"
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title || movie.name}
        loading="lazy"
      />
      <div className="catalog-card-overlay">
        <div className="catalog-card-actions">
          <button className="catalog-card-action-btn play" onClick={onClick} aria-label="Play">
            <FaPlay size={12} />
          </button>
          <button
            className={`catalog-card-action-btn${saved ? ' saved' : ''}`}
            onClick={handleToggleMyList}
            aria-label={saved ? 'Remove from My List' : 'Add to My List'}
          >
            {saved ? <FaCheck size={12} /> : <FaPlus size={12} />}
          </button>
        </div>
        <h3 className="catalog-card-title">{movie.title || movie.name}</h3>
      </div>
    </div>
  );
}

export default MovieCard;
