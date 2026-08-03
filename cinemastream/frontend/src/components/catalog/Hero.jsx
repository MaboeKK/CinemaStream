import React, { useEffect, useMemo, useState } from 'react';
import { FaPlay, FaPlus, FaCheck } from 'react-icons/fa';
import { fetchDiscoverMovie, fetchGenres, fetchMovieDetails } from '../../api/tmdb';
import { useMyList } from '../../hooks/useMyList';
import './Hero.css';

const MAX_CAROUSEL_DOTS = 5;

function formatRuntime(mins) {
  if (!mins) return null;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

function Hero({ onPlayTrailer }) {
  const [movies, setMovies] = useState([]);
  const [genreMap, setGenreMap] = useState({});
  const [runtimeCache, setRuntimeCache] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const { isSaved, toggle } = useMyList();

  useEffect(() => {
    // Capped to MAX_CAROUSEL_DOTS so the rotation index and the dot count
    // always agree -- otherwise currentIndex could advance past the last
    // rendered dot and none would show as active.
    fetchDiscoverMovie().then((items) => setMovies(items.slice(0, MAX_CAROUSEL_DOTS)));
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
  const dotCount = movies.length;

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

  return (
    <div
      className="hero"
      style={{ backgroundImage: `url(https://image.tmdb.org/t/p/original${featured.backdrop_path})` }}
    >
      <div className="hero-scrim" />
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="hero-eyebrow-rule" />
          CinemaStream Original
        </div>

        <h1 className="hero-title">{featured.title || featured.name}</h1>

        {/* Age rating (e.g. PG-13) and quality tags (e.g. 4K HDR) aren't in
            this data set -- TMDB's discover results carry no certification,
            and "quality/HDR" isn't a TMDB concept at all. Rather than show
            a fabricated rating on every title, genre pills (real data)
            fill that slot with the same thin-pill treatment instead. */}
        <div className="hero-meta">
          {matchPercent != null && (
            <span className="hero-meta-match">
              <FaCheck size={12} /> {matchPercent}% Match
            </span>
          )}
          {year && (
            <>
              <span className="hero-meta-divider">|</span>
              <span className="hero-meta-item">{year}</span>
            </>
          )}
          {runtimeLabel && (
            <>
              <span className="hero-meta-divider">|</span>
              <span className="hero-meta-item">{runtimeLabel}</span>
            </>
          )}
          {genreNames.length > 0 && <span className="hero-meta-divider">|</span>}
          {genreNames.map((name) => (
            <span className="hero-meta-pill" key={name}>
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

      {dotCount > 1 && (
        <div className="hero-dots">
          {Array.from({ length: dotCount }).map((_, i) => (
            <button
              key={i}
              className={`hero-dot${i === currentIndex ? ' active' : ''}`}
              aria-label={`Show featured title ${i + 1}`}
              onClick={() => setCurrentIndex(i)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Hero;
