import React from 'react';
import './MovieCard.css';

function MovieCard({ movie, onClick }) {
  return (
    <div className="movie-card-wrapper" onClick={onClick} style={{ cursor: 'pointer' }}>
      <div className="movie-card">
        <img
          className="movie-poster"
          src={`https://image.tmdb.org/t/p/w300${movie.poster_path}`}
          alt={movie.title || movie.name}
        />
      </div>
      <h3 className="movie-title">{movie.title || movie.name}</h3>
    </div>
  );
}

export default MovieCard;


