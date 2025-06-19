/* import React, { useState } from "react";
import "./AdminProfile.scss";

const AdminProfile = () => {
  const admin = {
    name: "Lewela Makgato",
    email: "lmakgato@cinemastream.com",
    lastlogin: "06-06-2025, 20:17",
  };

  const [adminData, setAdminData] = useState(admin);
  const [isEditing, setIsEditing] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData((prev) => ({ ...prev, [name]: value }));
  };

   const handleSave = () => {
    setIsEditing(false);
    console.log("Saved Data:", adminData);
  };

  const handleCancel = () => {
    setAdminData(admin);
    setIsEditing(false);
  };

  const getInitials = (fullName) => {
    const names = fullName.trim().split(" ");
    const initials = names.map(n => n[0]).join("");
    return initials.slice(0, 2).toUpperCase();
  };

  return (
    <div className="admin-profile">
      <h2>Admin Profile</h2>
      <div className="profile-card">
        <div className="initials">
          {getInitials(adminData.name)}
        </div>
        <div className="profile-info">
           {isEditing ? (
            <>
              <label>
                Name:
                <input name="name" value={adminData.name} onChange={handleChange} />
              </label>
              <label>
                Email:
                <input name="email" value={adminData.email} onChange={handleChange} />
              </label>
              <div className="btn-group">
                <button onClick={handleSave}>Save</button>
                <button className="cancel" onClick={handleCancel}>Cancel</button>
              </div>
            </>
          ) : (
          <>
          <h3>{adminData.name}</h3>
          <p><strong>Email:</strong> {adminData.email}</p>
          <p><strong>Last Login:</strong> {adminData.lastlogin}</p>
           <button onClick={() => setIsEditing(true)}>Edit Profile</button>
            </>
            )}
        </div>
      </div>
    </div>
  );
};

export default AdminProfile; */

import React, { useState } from "react";
import InitialsAvatar from "../avatar/InitialsAvatar";
import ProfileDropdown from "../profilestyle/ProfileDropdown";

const AdminProfile = () => {
  const [open, setOpen] = useState(false);
  const [adminData] = useState({
    name: "Lewela Makgato",
    email: "lmakgato@cinemastream.com",
    lastlogin: "06-06-2025, 20:17",
  });

  const handleEdit = () => {
    alert("Open full profile editor or navigate");
    setOpen(false);
  };

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <InitialsAvatar fullName={adminData.name} onClick={() => setOpen(!open)} />
      {open && (
        <ProfileDropdown
          adminData={adminData}
          onEdit={handleEdit}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminProfile;

