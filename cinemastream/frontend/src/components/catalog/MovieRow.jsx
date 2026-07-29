import React, { useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import './MovieRow.css';

function MovieRow({ title, fetchFunction, onMovieClick }) {
  const [movies, setMovies] = useState(null);
  const rowRef = useRef(null);

  useEffect(() => {
    fetchFunction()
      .then(setMovies)
      .catch((err) => {
        console.error('Failed to load row', title, err);
        setMovies([]);
      });
  }, [fetchFunction, title]);

  const scrollLeft = () => rowRef.current.scrollBy({ left: -500, behavior: 'smooth' });
  const scrollRight = () => rowRef.current.scrollBy({ left: 500, behavior: 'smooth' });

  if (movies !== null && movies.length === 0) return null;

  return (
    <div className="row-container">
      <h2 className="row-title">{title}</h2>
      <div className="row-wrapper">
        <button className="scroll-button left" onClick={scrollLeft}>
          &lt;
        </button>
        <div className="row-movies" ref={rowRef}>
          {movies === null
            ? Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="skeleton skeleton-card" />
              ))
            : movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  progress={movie.progress}
                  onClick={() => onMovieClick(movie)}
                />
              ))}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>
          &gt;
        </button>
      </div>
    </div>
  );
}

export default MovieRow;
