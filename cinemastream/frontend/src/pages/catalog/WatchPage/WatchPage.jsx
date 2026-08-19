import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useParams, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from 'react-icons/fa';
import { fetchMovieDetails, fetchSeriesDetails } from '../../../api/tmdb';
import { buildVidkingMovieUrl, buildVidkingTvUrl } from '../../../utils/vidking';
import watchApi from '../../../api/watchApi';
import './WatchPage.css';

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
  const [loading, setLoading] = useState(true);

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

  const src = isTv ? buildVidkingTvUrl(id, season, episode) : buildVidkingMovieUrl(id);

  // Portalled to document.body -- the route wrapper (.page-transition,
  // App.jsx) applies a fade transform, which makes it the containing block
  // for any descendant position:fixed element instead of the viewport,
  // collapsing this to zero height. Same root cause TrailerModal hit.
  return createPortal(
    <div className="watch-page">
      <button className="watch-page-back" onClick={() => navigate(-1)} aria-label="Back">
        <FaArrowLeft />
      </button>
      {loading && (
        <div className="watch-page-loading skeleton">
          <span>Loading{title !== 'Watch' ? ` ${title}` : ''}&hellip;</span>
        </div>
      )}
      <iframe
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
