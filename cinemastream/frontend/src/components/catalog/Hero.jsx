import React, { useEffect, useMemo, useState } from 'react';
import { FaPlay, FaPlus, FaCheck } from 'react-icons/fa';
import { fetchDiscoverMovie, fetchGenres } from '../../api/tmdb';
import { useMyList } from '../../hooks/useMyList';
import './Hero.css';

function Hero({ onPlayTrailer }) {
  const [movies, setMovies] = useState([]);
  const [genreMap, setGenreMap] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isSaved, toggle } = useMyList();

  useEffect(() => {
    fetchDiscoverMovie().then(setMovies);
    fetchGenres().then((genres) => {
      setGenreMap(Object.fromEntries(genres.map((g) => [g.id, g.name])));
    });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (movies.length ? (prev + 1) % movies.length : 0));
    }, 7000);
    return () => clearInterval(interval);
  }, [movies]);

  const featured = movies[currentIndex];

  const genreNames = useMemo(
    () => (featured?.genre_ids || []).slice(0, 2).map((id) => genreMap[id]).filter(Boolean),
    [featured, genreMap]
  );

  if (!featured) return <div className="hero" />;

  const year = featured.release_date?.slice(0, 4);
  const saved = isSaved(featured.id);

  return (
    <div
      className="hero"
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})` }}
    >
      <div className="hero-scrim" />
      <div className="hero-content">
        <h1 className="hero-title">{featured.title || featured.name}</h1>

        <div className="hero-badges">
          {featured.vote_average > 0 && (
            <span className="hero-badge rating">★ {featured.vote_average.toFixed(1)}</span>
          )}
          {year && <span className="hero-badge">{year}</span>}
          {genreNames.map((name) => (
            <span className="hero-badge" key={name}>
              {name}
            </span>
          ))}
        </div>

        <p className="hero-overview">{featured.overview}</p>

        <div className="hero-actions">
          <button className="hero-btn btn-primary" onClick={() => onPlayTrailer?.(featured)}>
            <FaPlay /> Watch Now
          </button>
          <button
            className={`hero-btn btn-secondary${saved ? ' active' : ''}`}
            onClick={() => toggle({ ...featured, media_type: 'movie' })}
          >
            {saved ? <FaCheck /> : <FaPlus />} My List
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
