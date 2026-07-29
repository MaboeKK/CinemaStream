import React, { useMemo } from 'react';
import { FaPlay, FaPlus, FaCheck, FaRegHeart, FaHeart } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { useMyList } from '../../hooks/useMyList';
import { useLikedTitles } from '../../hooks/useLikedTitles';
import { useGenreLookup } from '../../hooks/useGenreLookup';
import './MovieCard.css';

function MovieCard({ movie, onClick, progress }) {
  const { isSaved, toggle } = useMyList();
  const { isLiked, toggle: toggleLiked } = useLikedTitles();
  const genreMaps = useGenreLookup();
  const mediaType = movie.media_type || (movie.title ? 'movie' : 'tv');
  const saved = isSaved(movie.id);
  const liked = isLiked(movie.id);

  const year = (movie.release_date || movie.first_air_date)?.slice(0, 4);

  const genreNames = useMemo(() => {
    if (!genreMaps) return [];
    const map = mediaType === 'tv' ? genreMaps.tv : genreMaps.movie;
    return (movie.genre_ids || []).slice(0, 2).map((id) => map[id]).filter(Boolean);
  }, [genreMaps, mediaType, movie.genre_ids]);

  const handleToggleMyList = (e) => {
    e.stopPropagation();
    toggle({ ...movie, media_type: mediaType });
    toast.success(saved ? 'Removed from My List' : 'Added to My List');
  };

  const handleToggleLiked = (e) => {
    e.stopPropagation();
    toggleLiked({ ...movie, media_type: mediaType });
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
        <div className="catalog-card-badges">
          {movie.vote_average > 0 && (
            <span className="catalog-card-badge rating">★ {movie.vote_average.toFixed(1)}</span>
          )}
          {year && <span className="catalog-card-badge">{year}</span>}
          {genreNames.map((name) => (
            <span className="catalog-card-badge" key={name}>
              {name}
            </span>
          ))}
        </div>

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
          <button
            className={`catalog-card-action-btn${liked ? ' liked' : ''}`}
            onClick={handleToggleLiked}
            aria-label={liked ? 'Unlike' : 'Like'}
          >
            {liked ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
          </button>
        </div>
        <h3 className="catalog-card-title">{movie.title || movie.name}</h3>
      </div>
      {typeof progress === 'number' && (
        <div className="catalog-card-progress">
          <div className="catalog-card-progress-fill" style={{ width: `${progress}%` }} />
        </div>
      )}
    </div>
  );
}

export default MovieCard;
