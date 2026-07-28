import React, { useState } from 'react';
import { FaBell } from 'react-icons/fa';
import './NotificationsBell.css';

// Presentational only -- there's no notifications backend yet, so this
// intentionally never shows real data rather than fabricating any.
function NotificationsBell() {
  const [open, setOpen] = useState(false);

  return (
    <div className="notifications-bell-wrapper">
      <button className="notifications-bell" onClick={() => setOpen((prev) => !prev)} aria-label="Notifications">
        <FaBell />
      </button>
      {open && (
        <div className="notifications-dropdown">
          <p>No new notifications</p>
        </div>
      )}
    </div>
  );
}

export default NotificationsBell;
