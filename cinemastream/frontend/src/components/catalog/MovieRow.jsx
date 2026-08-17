import React, { useEffect, useRef, useState } from 'react';
import MovieCard from './MovieCard';
import './MovieRow.css';

// tabs (optional): [{ label, fetchFunction }, ...] -- renders a switcher in
// the row header and refetches on selection, in place of a single
// fetchFunction. Used by rows that show more than one data set (e.g.
// Trending Now's Movies/Series split) without changing the row's layout.
function MovieRow({ title, fetchFunction, tabs, onMovieClick, variant = 'poster', accent = false, tray = false }) {
  const [activeTab, setActiveTab] = useState(0);
  const [movies, setMovies] = useState(null);
  const rowRef = useRef(null);

  const activeFetch = tabs ? tabs[activeTab].fetchFunction : fetchFunction;

  useEffect(() => {
    setMovies(null);
    activeFetch()
      .then(setMovies)
      .catch((err) => {
        console.error('Failed to load row', title, err);
        setMovies([]);
      });
  }, [activeFetch, title]);

  const scrollLeft = () => rowRef.current.scrollBy({ left: -500, behavior: 'smooth' });
  const scrollRight = () => rowRef.current.scrollBy({ left: 500, behavior: 'smooth' });

  if (!tabs && movies !== null && movies.length === 0) return null;

  return (
    <div className={`row-container${tray ? ' tray' : ''}`}>
      <div className="row-header">
        <h2 className={`row-title${accent ? ' accent' : ''}`}>{title}</h2>
        {tabs && (
          <div className="row-tabs">
            {tabs.map((tab, i) => (
              <button
                key={tab.label}
                type="button"
                className={`row-tab${i === activeTab ? ' active' : ''}`}
                onClick={() => setActiveTab(i)}
              >
                {tab.label}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className="row-wrapper">
        <button className="scroll-button left" onClick={scrollLeft}>
          &lt;
        </button>
        <div className="row-movies" ref={rowRef}>
          {movies === null
            ? Array.from({ length: 6 }).map((_, i) => (
                <div
                  key={i}
                  className={`skeleton skeleton-card${variant === 'still' ? ' still' : ''}`}
                />
              ))
            : movies.map((movie) => (
                <MovieCard
                  key={movie.id}
                  movie={movie}
                  progress={movie.progress}
                  variant={variant}
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
