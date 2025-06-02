import React, { useEffect, useState } from 'react';
import './Row.css';
import MovieCard from '../MovieCard/MovieCard';

function Row({ title, fetchFunction, onMovieClick }) {
    const [movies, setMovies] = useState([]);
  
    useEffect(() => {
      const loadMovies = async () => {
        const data = await fetchFunction();
        setMovies(data);
      };
      loadMovies();
    }, [fetchFunction]);
  
    return (
      <div className="row-container">
        <h2 className="row-title">{title}</h2>
        <div className="row-movies">
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} onClick={() => onMovieClick(movie)} />
          ))}
        </div>
      </div>
    );
  }
  
  export default Row;
