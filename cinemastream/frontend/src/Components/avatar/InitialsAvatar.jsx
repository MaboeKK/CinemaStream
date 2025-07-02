import React from "react";
import "./InitialsAvatar.scss";

const InitialsAvatar = ({ fullName, onClick }) => {
  const getInitials = (name) => {
    if (!name) return "US";
    const names = name.trim().split(" ");
    const initials = names.map(n => n[0]?.toUpperCase() ?? "").join("");
    return initials.slice(0, 2);
  };

  return (
    <div className="initials-avatar" onClick={onClick} title="Admin Profile">
      {getInitials(fullName)}
    </div>
  );
};

export default InitialsAvatar;
