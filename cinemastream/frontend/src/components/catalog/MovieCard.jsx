import React from 'react';
import './MovieCard.css';

function MovieCard({ movie, onClick }) {
  return (
    <div className="catalog-card" onClick={onClick}>
      <img
        className="catalog-card-poster"
        src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
        alt={movie.title || movie.name}
      />
      <h3 className="catalog-card-title">{movie.title || movie.name}</h3>
    </div>
  );
}

export default MovieCard;
