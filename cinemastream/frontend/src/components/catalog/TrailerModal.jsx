import React, { useRef } from 'react';
import YouTube from 'react-youtube';
import watchApi from '../../api/watchApi';
import './TrailerModal.css';

function getVideoId(url) {
  const match = url?.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}

function TrailerModal({ isOpen, trailerUrl, modalContent = {}, onClose }) {
  const hasTrackedRef = useRef(false);

  if (!isOpen) return null;

  const { name = 'Details', overview = '', genres = [], actors = [], rawItem = null } = modalContent;
  const videoId = getVideoId(trailerUrl);

  const trackTrailerPlay = () => {
    if (!rawItem || hasTrackedRef.current) return;
    hasTrackedRef.current = true;

    const isMovie = rawItem.media_type === 'movie' || Boolean(rawItem.title);

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
    hasTrackedRef.current = false;
    onClose();
  };

  const onPlayerStateChange = (event) => {
    if (event.data === 1) trackTrailerPlay(); // 1 = playing
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={handleClose}>
          &times;
        </button>

        {videoId && (
          <YouTube
            videoId={videoId}
            opts={{ width: '100%', height: '400', playerVars: { autoplay: 1 } }}
            onStateChange={onPlayerStateChange}
          />
        )}

        <div className="modal-details">
          <h3>{name}</h3>
          <p>{overview}</p>

          <h4>Genres:</h4>
          <ul>
            {genres.map((genre) => (
              <li key={genre.id}>{genre.name}</li>
            ))}
          </ul>

          <h4>Actors:</h4>
          <ul className="actors-list">
            {actors.map((actor) => (
              <li key={actor.cast_id ?? actor.id} className="actor-item">
                {actor.profile_path && (
                  <img
                    src={`https://image.tmdb.org/t/p/w92${actor.profile_path}`}
                    alt={actor.name}
                    className="actor-image"
                  />
                )}
                <span>
                  {actor.name} as {actor.character}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default TrailerModal;
