import React from "react";
import "./InitialsAvatar.scss";

const InitialsAvatar = ({ firstName, lastName, onClick }) => {
  const getInitials = (firstName, lastName) => {
    const firstInitial = firstName?.trim()[0]?.toUpperCase() || "";
    const lastInitial = lastName?.trim()[0]?.toUpperCase() || "";
    return `${firstInitial}${lastInitial}` || "US";
  };

  return (
    <div className="initials-avatar" onClick={onClick} title="Admin Profile">
      {getInitials(firstName, lastName)}
    </div>
  );
};

export default InitialsAvatar;