import React, { useEffect, useRef, useState } from 'react';
import './Row.css';
import MovieCard from '../MovieCard/MovieCard';

function Row({ title, fetchFunction, onMovieClick }) {
  const [movies, setMovies] = useState([]);
  const [series, setSeries] = useState([]);
  const rowRef = useRef(null);

  useEffect(() => {
    const loadMovies = async () => {
      const data = await fetchFunction();
      setMovies(data);
    };
    loadMovies();
  }, [fetchFunction]);

//   useEffect(() => {
//   const loadSeries = async () => {
//     const series = await fetchFunction();
//     if (!series.length) {
//       console.warn("No series fetched");
//     }
//     setSeries(series);
//   };
//   loadSeries();
// }, []);

  const scrollLeft = () => {
    rowRef.current.scrollBy({ left: -500, behavior: 'smooth' });
  };

  const scrollRight = () => {
    rowRef.current.scrollBy({ left: 500, behavior: 'smooth' });
  };

  return (
    <div className="row-container">
      <h2 className="row-title">{title}</h2>
      <div className="row-wrapper">
        <button className="scroll-button left" onClick={scrollLeft}>&lt;</button>
        <div className="row-movies" ref={rowRef}>
          {movies.map((movie, index) => (
            <MovieCard key={index} movie={movie} onClick={() => onMovieClick(movie)} />
          ))}
           {/* {series.map((series, index) => (
            <MovieCard key={index} series={series} onClick={() => onMovieClick(series)} />
          ))} */}
        </div>
        <button className="scroll-button right" onClick={scrollRight}>&gt;</button>
      </div>
    </div>
  );
}

export default Row;

