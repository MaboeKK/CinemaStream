import React from 'react';
import './ProfileDropdown.scss';

const ProfileDropdown = ({ adminData, onClose }) => {
  const fullName = [adminData?.first_name, adminData?.last_name].filter(Boolean).join(' ');

  return (
    <div className="profile-dropdown">
      <div className="profile-info">
        <h3>{fullName || 'Admin'}</h3>
        <p>{adminData?.email || 'No email available'}</p>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ProfileDropdown;
