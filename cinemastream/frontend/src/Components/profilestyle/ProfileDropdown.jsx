import React from "react";
import "./ProfileDropdown.scss";

const ProfileDropdown = ({ adminData, onClose }) => {
  return (
    <div className="profile-dropdown">
      <div className="profile-info">
        <h3>{adminData?.name || "User"}</h3>
        <p>{adminData?.email || "No email available"}</p>
      </div>
      <button onClick={onClose}>Close</button>
    </div>
  );
};

export default ProfileDropdown;
