import React, { useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import './MovieRow.css';

function MovieRow({ title, fetchFunction, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    fetchFunction().then(setMovies);
  }, [fetchFunction]);

  const scrollLeft = () => rowRef.current.scrollBy({ left: -500, behavior: 'smooth' });
  const scrollRight = () => rowRef.current.scrollBy({ left: 500, behavior: 'smooth' });

  return (
    <div className="row-container">
      <h2 className="row-title">{title}</h2>
      <div className="row-wrapper">
        <button className="scroll-button left" onClick={scrollLeft}>
          &lt;
        </button>
        <div className="row-movies" ref={rowRef}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} onClick={() => onMovieClick(movie)} />
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
