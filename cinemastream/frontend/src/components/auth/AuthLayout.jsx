import React from 'react';
import '../../styles/Auth.css';

// Purely decorative -- thin arcs + dots sitting between the ambient glow
// background and the glass card, echoing the ring shape from the app's own
// favicon mark. Kept as inert markup (aria-hidden, pointer-events: none via
// CSS) so it never competes with the form for attention or a11y focus.
//
// The two soft blobs positioned near center (behind where the card lands)
// are the actual mechanism that makes backdrop-filter blur read as glass:
// blurring the smooth .auth-page background gradient does nothing visible
// since there's no detail there to soften, so without something with real
// contrast sitting directly behind the panel, the blur is technically
// applied but invisible. This is a separate decorative layer, not a change
// to .auth-page's own background.
const AuthDecor = () => (
  <svg className="auth-decor" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
    <defs>
      <radialGradient id="auth-decor-glow-violet" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#8b5cf6" stopOpacity="0.16" />
        <stop offset="60%" stopColor="#8b5cf6" stopOpacity="0.04" />
        <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="auth-decor-glow-pink" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#f453a6" stopOpacity="0.13" />
        <stop offset="60%" stopColor="#f453a6" stopOpacity="0.03" />
        <stop offset="100%" stopColor="#f453a6" stopOpacity="0" />
      </radialGradient>
    </defs>
    {/* Smaller radius than before + a mid-stop that drops off faster --
        keeps the color mostly inside/just behind the card (where the blur
        picks it up) instead of visibly bleeding onto the plain page around
        the panel's edges. */}
    <circle cx="440" cy="450" r="170" fill="url(#auth-decor-glow-violet)" />
    <circle cx="580" cy="560" r="150" fill="url(#auth-decor-glow-pink)" />
    <circle cx="120" cy="160" r="220" className="auth-decor-arc" style={{ strokeDasharray: '520 900' }} />
    <circle cx="880" cy="120" r="160" className="auth-decor-arc" style={{ strokeDasharray: '360 640' }} />
    <circle cx="920" cy="860" r="260" className="auth-decor-arc" style={{ strokeDasharray: '600 1080' }} />
    <circle cx="60" cy="820" r="130" className="auth-decor-arc" style={{ strokeDasharray: '280 500' }} />
    <circle cx="220" cy="80" r="4" className="auth-decor-dot" />
    <circle cx="760" cy="60" r="3" className="auth-decor-dot" />
    <circle cx="960" cy="380" r="3" className="auth-decor-dot" />
    <circle cx="40" cy="480" r="4" className="auth-decor-dot" />
    <circle cx="140" cy="940" r="3" className="auth-decor-dot" />
    <circle cx="840" cy="960" r="4" className="auth-decor-dot" />
    <circle cx="960" cy="700" r="3" className="auth-decor-dot" />
    <circle cx="30" cy="260" r="3" className="auth-decor-dot" />
  </svg>
);

// Shared wrapper for every auth page (login, register, verify-otp,
// forgot/reset password) -- replaces 5 near-identical copies of this same
// markup, CSS file, and background image.
const AuthLayout = ({ children }) => (
  <div className="auth-page">
    <AuthDecor />
    <div className="wrapper">{children}</div>
  </div>
);

export default AuthLayout;
