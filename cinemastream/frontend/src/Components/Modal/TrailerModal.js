import React from "react";
import "./TrailerModal.css";

function TrailerModal({ isOpen, trailerUrl, modalContent = {}, onClose }) {
  if (!isOpen) return null;

  const { name = "Series Details", overview = "", genres = [], actors = [] } = modalContent;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>×</button>

        {trailerUrl && (
          <iframe
            width="100%"
            height="400"
            src={trailerUrl}
            title="Trailer"
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
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
              <li key={actor.cast_id} className="actor-item">
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
