import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaExchangeAlt } from 'react-icons/fa';
import { fetchMovieDetails, fetchSeriesDetails } from '../../../api/tmdb';
import { WATCH_SOURCES } from '../../../utils/watchSources';
import watchApi from '../../../api/watchApi';
import './WatchPage.css';

// How long to wait for the active source's iframe to fire onLoad before
// assuming it's unreachable and silently falling back to the next one in
// WATCH_SOURCES. This only catches a source being fully down (DNS/
// connection failure) -- a cross-origin iframe can't tell us when the
// embedded page loads fine but its own internal video-source resolution
// fails, which in practice happens per-title on both providers. That's
// what the manual "switch source" button below is for.
const LOAD_TIMEOUT_MS = 8000;

// Full-page player, matching how sites built on the same vidking embed
// (e.g. cineby.at) present it: their own chrome (just a back button) around
// an edge-to-edge iframe, instead of squeezing the player into a modal.
// Handles both /watch/movie/:id and /watch/tv/:id/:season/:episode --
// season/episode are only present on the TV route.
function WatchPage() {
  const { id, season, episode } = useParams();
  const isTv = season !== undefined;
  const navigate = useNavigate();
  const [title, setTitle] = useState('Watch');
  const [sourceIndex, setSourceIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  // A ref, not state -- flipping it must never itself trigger a re-render
  // or re-run the fallback-arming effect below.
  const autoFallbackTried = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const fetchDetails = isTv ? fetchSeriesDetails : fetchMovieDetails;
    fetchDetails(id)
      .then((details) => {
        if (cancelled) return;
        setTitle(details.name);
        watchApi
          .recordWatch(
            isTv
              ? { seriesId: Number(id), seriesName: details.name }
              : { movieId: Number(id), movieTitle: details.name }
          )
          .catch((err) => console.error('Failed to record watch event', err));
      })
      .catch((error) => console.error('Failed to load details', error));
    return () => {
      cancelled = true;
    };
  }, [id, isTv]);

  // New title routed to -- always start from WATCH_SOURCES[0] and re-arm
  // the auto-fallback, regardless of which source the previous title ended
  // up showing.
  useEffect(() => {
    autoFallbackTried.current = false;
    setSourceIndex(0);
  }, [id, season, episode]);

  useEffect(() => {
    setLoading(true);
  }, [sourceIndex]);

  const nextIndex = (sourceIndex + 1) % WATCH_SOURCES.length;

  useEffect(() => {
    if (!loading) return undefined;
    const timer = setTimeout(() => {
      if (autoFallbackTried.current) return;
      autoFallbackTried.current = true;
      setSourceIndex(nextIndex);
    }, LOAD_TIMEOUT_MS);
    return () => clearTimeout(timer);
  }, [loading, nextIndex]);

  const activeSource = WATCH_SOURCES[sourceIndex];
  const nextSource = WATCH_SOURCES[nextIndex];
  const src = activeSource.buildUrl(isTv, id, season, episode);

  const switchSource = () => {
    // Counts as "already tried a fallback" so a slow-loading next source
    // doesn't get auto-cycled past without the viewer noticing -- the
    // button stays the one way out from here.
    autoFallbackTried.current = true;
    setSourceIndex(nextIndex);
  };

  // Portalled to document.body -- the route wrapper (.page-transition,
  // App.jsx) applies a fade transform, which makes it the containing block
  // for any descendant position:fixed element instead of the viewport,
  // collapsing this to zero height. Same root cause TrailerModal hit.
  return createPortal(
    <div className="watch-page">
      <button className="watch-page-back" onClick={() => navigate(-1)} aria-label="Back">
        <FaArrowLeft />
      </button>
      <button
        className="watch-page-source-toggle"
        onClick={switchSource}
        aria-label={`Switch to ${nextSource.label}`}
      >
        <FaExchangeAlt />
        {nextSource.label}
      </button>
      {loading && (
        <div className="watch-page-loading skeleton">
          <span>Loading{title !== 'Watch' ? ` ${title}` : ''}&hellip;</span>
        </div>
      )}
      <iframe
        key={sourceIndex}
        className="watch-page-player"
        src={src}
        allow="autoplay; fullscreen"
        allowFullScreen
        title={title}
        onLoad={() => setLoading(false)}
      />
    </div>,
    document.body
  );
}

export default WatchPage;
