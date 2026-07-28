import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import InitialsAvatar from '../InitialsAvatar';
import { useAuth } from '../../context/AuthContext';
import './ProfileMenu.css';

function ProfileMenu() {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(' ');

  return (
    <div className="profile-menu-wrapper">
      <InitialsAvatar
        firstName={user?.first_name || ''}
        lastName={user?.last_name || ''}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && (
        <div className="profile-menu-dropdown">
          <p className="profile-menu-name">{fullName || 'Account'}</p>
          <p className="profile-menu-email">{user?.email}</p>
          <button className="profile-menu-logout" onClick={handleLogout}>
            Logout
          </button>
        </div>
      )}
    </div>
  );
}

export default ProfileMenu;
