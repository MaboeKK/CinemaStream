import React, { useEffect, useMemo, useState } from 'react';
import { FaPlay, FaPlus, FaCheck, FaFire } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchDiscoverMovie, fetchGenres, fetchTrending, fetchMovieDetails } from '../../api/tmdb';
import { useMyList } from '../../hooks/useMyList';
import './Hero.css';

function formatRuntime(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function Hero({ onPlayTrailer }) {
  const [movies, setMovies] = useState([]);
  const [genreMap, setGenreMap] = useState({});
  const [trendingIds, setTrendingIds] = useState(() => new Set());
  const [runtimeCache, setRuntimeCache] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isSaved, toggle } = useMyList();

  useEffect(() => {
    fetchDiscoverMovie().then(setMovies);
    fetchGenres().then((genres) => {
      setGenreMap(Object.fromEntries(genres.map((g) => [g.id, g.name])));
    });
    fetchTrending().then((items) => {
      setTrendingIds(new Set(items.map((item) => item.id)));
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

  useEffect(() => {
    if (!featured || runtimeCache[featured.id] != null) return;
    let cancelled = false;
    fetchMovieDetails(featured.id).then((details) => {
      if (!cancelled) {
        setRuntimeCache((prev) => ({ ...prev, [featured.id]: details.runtime || null }));
      }
    });
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [featured]);

  if (!featured) {
    return (
      <div className="hero hero-loading">
        <div className="hero-content">
          <div className="skeleton hero-skel-title" />
          <div className="hero-skel-badges">
            <div className="skeleton hero-skel-badge" />
            <div className="skeleton hero-skel-badge" />
            <div className="skeleton hero-skel-badge" />
          </div>
          <div className="skeleton hero-skel-line" />
          <div className="skeleton hero-skel-line short" />
          <div className="hero-skel-actions">
            <div className="skeleton hero-skel-btn" />
            <div className="skeleton hero-skel-btn" />
          </div>
        </div>
      </div>
    );
  }

  const year = featured.release_date?.slice(0, 4);
  const saved = isSaved(featured.id);
  const matchPercent = featured.vote_average > 0 ? Math.round(featured.vote_average * 10) : null;
  const runtimeLabel = formatRuntime(runtimeCache[featured.id]);
  const isTrending = trendingIds.has(featured.id);

  return (
    <div
      className="hero"
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})` }}
    >
      <div className="hero-scrim" />
      <div className="hero-content">
        <h1 className="hero-title">{featured.title || featured.name}</h1>

        <div className="hero-badges">
          {isTrending && (
            <span className="hero-badge trending">
              <FaFire /> Trending
            </span>
          )}
          {matchPercent != null && <span className="hero-badge match">{matchPercent}% Match</span>}
          {featured.vote_average > 0 && (
            <span className="hero-badge rating">★ {featured.vote_average.toFixed(1)} Rating</span>
          )}
          {year && <span className="hero-badge">{year}</span>}
          {runtimeLabel && <span className="hero-badge">{runtimeLabel}</span>}
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
            onClick={() => {
              toggle({ ...featured, media_type: 'movie' });
              toast.success(saved ? 'Removed from My List' : 'Added to My List');
            }}
          >
            {saved ? <FaCheck /> : <FaPlus />} My List
          </button>
        </div>
      </div>
    </div>
  );
}

export default Hero;
