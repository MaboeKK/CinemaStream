import React, { useRef, useEffect } from "react";
import "./ProfileDropdown.scss";

const ProfileDropdown = ({ adminData, onEdit, onClose }) => {
  const dropdownRef = useRef();

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  return (
    <div className="profile-dropdown" ref={dropdownRef}>
      <h4>{adminData.name}</h4>
      <p>{adminData.email}</p>
      {/* <p className="login">Last Login: {adminData.lastlogin}</p>
      <button onClick={onEdit}>Edit Profile</button> */}
    </div>
  );
};

export default ProfileDropdown;