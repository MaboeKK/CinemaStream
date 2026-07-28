import React, { useState } from 'react';
import InitialsAvatar from './InitialsAvatar';
import ProfileDropdown from './ProfileDropdown';
import './AdminProfile.scss';

const AdminProfile = ({ user }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="admin-profile-wrapper">
      <InitialsAvatar
        firstName={user?.first_name || ''}
        lastName={user?.last_name || ''}
        onClick={() => setOpen((prev) => !prev)}
      />
      {open && <ProfileDropdown adminData={user} onClose={() => setOpen(false)} />}
    </div>
  );
};

export default AdminProfile;
