import React, { useState } from "react";
import InitialsAvatar from "../avatar/InitialsAvatar";
import ProfileDropdown from "../profilestyle/ProfileDropdown";

const AdminProfile = () => {
  const [open, setOpen] = useState(false);
  const [adminData] = useState({
    name: "Lewela Makgato",
    email: "lmakgato@cinemastream.com",
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

