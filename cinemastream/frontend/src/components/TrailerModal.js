// src/components/TrailerModal.js
import React from "react";

const TrailerModal = ({ trailerUrl, onClose }) => {
  if (!trailerUrl) return null;

  return (
    <div className="trailer-modal">
      <div className="trailer-content">
        <button onClick={onClose} className="close-btn">X</button>
        <iframe
          width="100%"
          height="400"
          src={trailerUrl}
          title="Trailer"
          frameBorder="0"
          allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default TrailerModal;
