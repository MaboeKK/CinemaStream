import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFire, FaSearch } from 'react-icons/fa';
import { fetchGenres, fetchTrending, searchMovies, searchSeries } from '../../api/tmdb';
import { useRecentSearches } from '../../hooks/useRecentSearches';
import EmptyState from './EmptyState';
import './SearchOverlay.css';

const POSTER_BASE = 'https://image.tmdb.org/t/p/w92';

function SearchOverlay({ term, onSelect, onClear }) {
  const navigate = useNavigate();
  const { recent, add, clear } = useRecentSearches();
  const [genres, setGenres] = useState([]);
  const [trending, setTrending] = useState([]);
  const [movieResults, setMovieResults] = useState([]);
  const [seriesResults, setSeriesResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchGenres().then(setGenres);
    fetchTrending().then((items) => setTrending(items.slice(0, 5)));
  }, []);

  const trimmed = term.trim();

  useEffect(() => {
    if (!trimmed) {
      setMovieResults([]);
      setSeriesResults([]);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([searchMovies(trimmed), searchSeries(trimmed)])
      .then(([movies, series]) => {
        if (!cancelled) {
          setMovieResults(movies.slice(0, 5));
          setSeriesResults(series.slice(0, 5));
        }
      })
      .catch((err) => console.error('Search overlay lookup failed', err))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [trimmed]);

  const matchingGenres = useMemo(() => {
    if (!trimmed) return [];
    const needle = trimmed.toLowerCase();
    return genres.filter((genre) => genre.name.toLowerCase().includes(needle)).slice(0, 5);
  }, [trimmed, genres]);

  const goTo = (path, termToSave) => {
    if (termToSave) add(termToSave);
    navigate(path);
    onSelect?.();
  };

  const hasQuery = trimmed.length > 0;
  const hasResults = movieResults.length > 0 || seriesResults.length > 0 || matchingGenres.length > 0;

  return (
    <div className="search-overlay">
      {!hasQuery && (
        <>
          {recent.length > 0 && (
            <div className="search-overlay-section">
              <div className="search-overlay-section-header">
                <span>Recent Searches</span>
                <button type="button" className="search-overlay-clear" onClick={clear}>
                  Clear
                </button>
              </div>
              <div className="search-overlay-chips">
                {recent.map((entry) => (
                  <button
                    key={entry}
                    type="button"
                    className="search-overlay-chip"
                    onClick={() => goTo(`/movies?q=${encodeURIComponent(entry)}`, entry)}
                  >
                    {entry}
                  </button>
                ))}
              </div>
            </div>
          )}

          {trending.length > 0 && (
            <div className="search-overlay-section">
              <div className="search-overlay-section-header">
                <span>
                  <FaFire /> Trending Now
                </span>
              </div>
              <div className="search-overlay-list">
                {trending.map((item) => (
                  <button
                    key={`${item.media_type}-${item.id}`}
                    type="button"
                    className="search-overlay-result"
                    onClick={() =>
                      goTo(
                        item.media_type === 'tv'
                          ? `/series?q=${encodeURIComponent(item.name)}`
                          : `/movies?q=${encodeURIComponent(item.title || item.name)}`
                      )
                    }
                  >
                    {item.poster_path && (
                      <img src={`${POSTER_BASE}${item.poster_path}`} alt="" className="search-overlay-thumb" />
                    )}
                    <span className="search-overlay-result-title">{item.title || item.name}</span>
                    <span className="search-overlay-result-tag">{item.media_type === 'tv' ? 'TV' : 'Movie'}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {recent.length === 0 && trending.length === 0 && (
            <EmptyState
              compact
              icon={<FaSearch />}
              title="Start typing to search"
              description="Find titles and genres across CinemaStream."
            />
          )}
        </>
      )}

      {hasQuery && (
        <>
          {loading && (
            <div className="search-overlay-list">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="search-overlay-skeleton-row">
                  <div className="skeleton search-overlay-skeleton-thumb" />
                  <div className="skeleton search-overlay-skeleton-line" />
                </div>
              ))}
            </div>
          )}

          {!loading && !hasResults && (
            <EmptyState
              compact
              icon={<FaSearch />}
              title={`No results for "${trimmed}"`}
              description="Try a different title or genre."
              actionLabel={onClear ? 'Clear search' : undefined}
              onAction={onClear}
            />
          )}

          {movieResults.length > 0 && (
            <div className="search-overlay-section">
              <div className="search-overlay-section-header">
                <span>Movies</span>
              </div>
              <div className="search-overlay-list">
                {movieResults.map((movie) => (
                  <button
                    key={movie.id}
                    type="button"
                    className="search-overlay-result"
                    onClick={() => goTo(`/movies?q=${encodeURIComponent(movie.title)}`, trimmed)}
                  >
                    {movie.poster_path && (
                      <img src={`${POSTER_BASE}${movie.poster_path}`} alt="" className="search-overlay-thumb" />
                    )}
                    <span className="search-overlay-result-title">{movie.title}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {seriesResults.length > 0 && (
            <div className="search-overlay-section">
              <div className="search-overlay-section-header">
                <span>TV Series</span>
              </div>
              <div className="search-overlay-list">
                {seriesResults.map((show) => (
                  <button
                    key={show.id}
                    type="button"
                    className="search-overlay-result"
                    onClick={() => goTo(`/series?q=${encodeURIComponent(show.name)}`, trimmed)}
                  >
                    {show.poster_path && (
                      <img src={`${POSTER_BASE}${show.poster_path}`} alt="" className="search-overlay-thumb" />
                    )}
                    <span className="search-overlay-result-title">{show.name}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {matchingGenres.length > 0 && (
            <div className="search-overlay-section">
              <div className="search-overlay-section-header">
                <span>Genres</span>
              </div>
              <div className="search-overlay-chips">
                {matchingGenres.map((genre) => (
                  <button
                    key={genre.id}
                    type="button"
                    className="search-overlay-chip"
                    onClick={() => goTo(`/movies?genre=${genre.id}`, trimmed)}
                  >
                    {genre.name}
                  </button>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default SearchOverlay;
