import React from 'react';
import { Link } from 'react-router-dom';
import './EmptyState.css';

function EmptyState({ icon, title, description, actionLabel, actionTo, onAction, compact = false }) {
  return (
    <div className={`empty-state${compact ? ' compact' : ''}`}>
      {icon && <div className="empty-state-icon">{icon}</div>}
      <h3 className="empty-state-title">{title}</h3>
      {description && <p className="empty-state-description">{description}</p>}
      {actionLabel && actionTo && (
        <Link to={actionTo} className="btn-primary empty-state-action">
          {actionLabel}
        </Link>
      )}
      {actionLabel && onAction && !actionTo && (
        <button type="button" className="btn-secondary empty-state-action" onClick={onAction}>
          {actionLabel}
        </button>
      )}
    </div>
  );
}

export default EmptyState;
