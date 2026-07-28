import React, { useEffect, useState } from 'react';
import { fetchDiscoverMovie } from '../../api/tmdb';
import './Banner.css';

function Banner({ onPlayTrailer }) {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchDiscoverMovie().then(setMovies);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (movies.length ? (prevIndex + 1) % movies.length : 0));
    }, 5000);
    return () => clearInterval(interval);
  }, [movies]);

  if (movies.length === 0) return null;

  const featuredMovie = movies[currentIndex];

  return (
    <div
      className="banner"
      style={{
        backgroundImage: `url(https://image.tmdb.org/t/p/original${featuredMovie.backdrop_path})`,
      }}
    >
      <h1 className="banner-title">{featuredMovie.title || featuredMovie.name}</h1>
      <p className="banner-overview">
        {featuredMovie.overview.length > 300
          ? featuredMovie.overview.slice(0, 300)
          : featuredMovie.overview}
      </p>
      <button className="banner-button" onClick={() => onPlayTrailer?.(featuredMovie)}>
        Play trailer
      </button>
    </div>
  );
}

export default Banner;
