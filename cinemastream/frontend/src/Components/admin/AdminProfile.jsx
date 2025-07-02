import React, { useState } from "react";
import InitialsAvatar from "../avatar/InitialsAvatar";
import ProfileDropdown from "../profilestyle/ProfileDropdown";

const AdminProfile = ({ user }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <InitialsAvatar 
        firstName={user?.first_name || ""}
        lastName={user?.last_name || ""}
        onClick={() => setOpen(!open)} 
      />
      {open && (
        <ProfileDropdown
          adminData={user}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default AdminProfile;