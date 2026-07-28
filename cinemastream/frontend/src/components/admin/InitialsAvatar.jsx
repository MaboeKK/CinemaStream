import React from 'react';
import './InitialsAvatar.scss';

const InitialsAvatar = ({ firstName, lastName, onClick }) => {
  const getInitials = () => {
    const firstInitial = firstName?.trim()[0]?.toUpperCase() || '';
    const lastInitial = lastName?.trim()[0]?.toUpperCase() || '';
    return `${firstInitial}${lastInitial}` || 'US';
  };

  return (
    <div className="initials-avatar" onClick={onClick} title="Admin Profile">
      {getInitials()}
    </div>
  );
};

export default InitialsAvatar;
