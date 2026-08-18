import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import YouTube from 'react-youtube';
import { FaPlay } from 'react-icons/fa';
import { fetchMovieDetails, fetchSeriesDetails, fetchSimilarMovies, fetchSimilarSeries } from '../../api/tmdb';
import { fetchYoutubeTrailer } from '../../api/youtube';
import watchApi from '../../api/watchApi';
import './TrailerModal.css';

const CLOSE_ANIMATION_MS = 200;
// Matches --color-accent in index.css -- vidking's embed only exposes a
// single flat "color" param (no gradient support), so this is the closest
// on-brand match to the site's sunset gradient.
const VIDKING_ACCENT_COLOR = 'f453a6';

function getVideoId(url) {
  const match = url?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}

function isMovieItem(item) {
  return item?.media_type === 'movie' || Boolean(item?.title);
}

function TrailerModal({ isOpen, trailerUrl, modalContent = {}, onClose }) {
  const hasTrackedRef = useRef(false);
  const contentRef = useRef(null);

  const [shouldRender, setShouldRender] = useState(isOpen);
  const [closing, setClosing] = useState(false);
  const [activeContent, setActiveContent] = useState(modalContent);
  const [activeTrailerUrl, setActiveTrailerUrl] = useState(trailerUrl);
  // null (choice screen) | 'trailer' (YouTube) | 'content' (vidking)
  const [playbackMode, setPlaybackMode] = useState(null);
  const [contentLoading, setContentLoading] = useState(false);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    setActiveContent(modalContent);
    setActiveTrailerUrl(trailerUrl);
    setPlaybackMode(null);
    setContentLoading(false);
    hasTrackedRef.current = false;
    setClosing(false);
    setShouldRender(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen]);

  useEffect(() => {
    const rawItem = activeContent?.rawItem;
    if (!rawItem) {
      setSimilar([]);
      return;
    }
    const fetchSimilar = isMovieItem(rawItem) ? fetchSimilarMovies : fetchSimilarSeries;
    let cancelled = false;
    fetchSimilar(rawItem.id)
      .then((items) => {
        if (!cancelled) setSimilar(items.slice(0, 10));
      })
      .catch((err) => {
        console.error('Failed to load similar titles', err);
        if (!cancelled) setSimilar([]);
      });
    return () => {
      cancelled = true;
    };
  }, [activeContent]);

  if (!shouldRender) return null;

  const { name = 'Details', overview = '', genres = [], actors = [], rawItem = null } = activeContent || {};
  const videoId = getVideoId(activeTrailerUrl);
  const isMovie = isMovieItem(rawItem);
  // Full-content playback via vidking.net, alongside the existing YouTube
  // trailer -- movies only for now (no season/episode picker exists yet
  // for a TV content embed).
  const vidkingUrl = isMovie && rawItem?.id
    ? `https://www.vidking.net/embed/movie/${rawItem.id}?color=${VIDKING_ACCENT_COLOR}&autoPlay=true`
    : null;
  const backdropUrl = rawItem?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${rawItem.backdrop_path}`
    : rawItem?.poster_path
      ? `https://image.tmdb.org/t/p/w780${rawItem.poster_path}`
      : null;

  const trackWatch = () => {
    if (!rawItem || hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    const isMovie = isMovieItem(rawItem);

    watchApi
      .recordWatch({
        movieId: isMovie ? rawItem.id : undefined,
        seriesId: !isMovie ? rawItem.id : undefined,
        movieTitle: isMovie ? rawItem.title || rawItem.name : undefined,
        seriesName: !isMovie ? rawItem.name || rawItem.title : undefined,
      })
      .catch((err) => console.error('Failed to record watch event', err));
  };

  const handleClose = () => {
    setClosing(true);
    setTimeout(() => {
      setShouldRender(false);
      onClose();
    }, CLOSE_ANIMATION_MS);
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1) trackWatch(); // 1 = playing
  };

  const handleWatchContent = () => {
    trackWatch();
    setContentLoading(true);
    setPlaybackMode('content');
  };

  const handleSelectSimilar = async (item) => {
    try {
      const isMovie = isMovieItem(item);
      const details = isMovie ? await fetchMovieDetails(item.id) : await fetchSeriesDetails(item.id);
      const url = await fetchYoutubeTrailer(details.name);

      setActiveContent({ ...details, rawItem: { ...item, media_type: isMovie ? 'movie' : 'tv' } });
      setActiveTrailerUrl(url);
      setPlaybackMode(null);
      setContentLoading(false);
      hasTrackedRef.current = false;
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to load similar title details', error);
    }
  };

  return createPortal(
    <div className={`modal-overlay${closing ? ' closing' : ''}`} onClick={handleClose}>
      <div className="modal-content" ref={contentRef} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>

        <div className="modal-hero" style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : undefined}>
          {playbackMode === null && (
            <>
              <div className="modal-hero-scrim" />
              <div className="modal-play-actions">
                {videoId && (
                  <button className="modal-play-trailer btn-secondary" onClick={() => setPlaybackMode('trailer')}>
                    <FaPlay /> Watch Trailer
                  </button>
                )}
                {vidkingUrl && (
                  <button className="modal-play-trailer btn-primary" onClick={handleWatchContent}>
                    <FaPlay /> Watch Content
                  </button>
                )}
              </div>
            </>
          )}

          {playbackMode === 'content' && vidkingUrl && (
            <>
              {contentLoading && (
                <div className="modal-hero-loading skeleton">
                  <span>Loading{name && name !== 'Details' ? ` ${name}` : ''}&hellip;</span>
                </div>
              )}
              <iframe
                className="modal-hero-player modal-hero-player-iframe"
                src={vidkingUrl}
                allow="autoplay; fullscreen"
                allowFullScreen
                title={name}
                onLoad={() => setContentLoading(false)}
              />
            </>
          )}

          {playbackMode === 'trailer' && videoId && (
            <YouTube
              videoId={videoId}
              className="modal-hero-player"
              iframeClassName="modal-hero-player-iframe"
              // No width/height here -- the YouTube IFrame API only accepts pixel
              // numbers for those, so '100%' silently fell back to the player's
              // own default size (~640x390) instead of filling .modal-hero.
              // Sized via CSS on the iframe itself instead (see TrailerModal.css).
              opts={{ playerVars: { autoplay: 1 } }}
              onStateChange={onPlayerStateChange}
            />
          )}
        </div>

        <div className="modal-details">
          <h3>{name}</h3>

          {genres.length > 0 && (
            <div className="modal-genre-tags">
              {genres.map((genre) => (
                <span key={genre.id} className="modal-genre-tag">
                  {genre.name}
                </span>
              ))}
            </div>
          )}

          <p>{overview}</p>

          {actors.length > 0 && (
            <>
              <h4>Cast</h4>
              <div className="modal-cast-list">
                {actors.map((actor) => (
                  <div key={actor.cast_id ?? actor.id} className="modal-cast-item">
                    {actor.profile_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                        alt={actor.name}
                        className="modal-cast-image"
                      />
                    )}
                    <span className="modal-cast-name">{actor.name}</span>
                    <span className="modal-cast-character">{actor.character}</span>
                  </div>
                ))}
              </div>
            </>
          )}

          {similar.length > 0 && (
            <>
              <h4>More Like This</h4>
              <div className="modal-similar-row">
                {similar.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    className="modal-similar-card"
                    onClick={() => handleSelectSimilar(item)}
                  >
                    {item.poster_path && (
                      <img
                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                        alt={item.title || item.name}
                      />
                    )}
                    <span>{item.title || item.name}</span>
                  </button>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>,
    document.body
  );
}

export default TrailerModal;
