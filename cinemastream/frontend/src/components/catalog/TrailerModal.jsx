import React, { useEffect, useRef, useState } from 'react';
import YouTube from 'react-youtube';
import { FaPlay } from 'react-icons/fa';
import { fetchMovieDetails, fetchSeriesDetails, fetchSimilarMovies, fetchSimilarSeries } from '../../api/tmdb';
import { fetchYoutubeTrailer } from '../../api/youtube';
import watchApi from '../../api/watchApi';
import './TrailerModal.css';

const CLOSE_ANIMATION_MS = 200;

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
  const [playingTrailer, setPlayingTrailer] = useState(false);
  const [similar, setSimilar] = useState([]);

  useEffect(() => {
    if (!isOpen) return;
    setActiveContent(modalContent);
    setActiveTrailerUrl(trailerUrl);
    setPlayingTrailer(false);
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
  const backdropUrl = rawItem?.backdrop_path
    ? `https://image.tmdb.org/t/p/original${rawItem.backdrop_path}`
    : rawItem?.poster_path
      ? `https://image.tmdb.org/t/p/w780${rawItem.poster_path}`
      : null;

  const trackTrailerPlay = () => {
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
    if (event.data === 1) trackTrailerPlay(); // 1 = playing
  };

  const handleSelectSimilar = async (item) => {
    try {
      const isMovie = isMovieItem(item);
      const details = isMovie ? await fetchMovieDetails(item.id) : await fetchSeriesDetails(item.id);
      const url = await fetchYoutubeTrailer(details.name);

      setActiveContent({ ...details, rawItem: { ...item, media_type: isMovie ? 'movie' : 'tv' } });
      setActiveTrailerUrl(url);
      setPlayingTrailer(false);
      hasTrackedRef.current = false;
      contentRef.current?.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (error) {
      console.error('Failed to load similar title details', error);
    }
  };

  return (
    <div className={`modal-overlay${closing ? ' closing' : ''}`} onClick={handleClose}>
      <div className="modal-content" ref={contentRef} onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>

        <div className="modal-hero" style={backdropUrl ? { backgroundImage: `url(${backdropUrl})` } : undefined}>
          {!playingTrailer ? (
            <>
              <div className="modal-hero-scrim" />
              {videoId && (
                <button className="modal-play-trailer btn-primary" onClick={() => setPlayingTrailer(true)}>
                  <FaPlay /> Play Trailer
                </button>
              )}
            </>
          ) : (
            videoId && (
              <YouTube
                videoId={videoId}
                opts={{ width: '100%', height: '400', playerVars: { autoplay: 1 } }}
                onStateChange={onPlayerStateChange}
              />
            )
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
    </div>
  );
}

export default TrailerModal;
