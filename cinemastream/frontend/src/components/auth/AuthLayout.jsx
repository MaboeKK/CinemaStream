import React from 'react';
import '../../styles/Auth.css';

// Shared wrapper for every auth page (login, register, verify-otp,
// forgot/reset password) -- replaces 5 near-identical copies of this same
// markup, CSS file, and background image.
const AuthLayout = ({ children }) => (
  <div className="auth-page">
    <div className="wrapper">{children}</div>
  </div>
);

export default AuthLayout;
