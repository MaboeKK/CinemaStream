import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Auth.css"; // Same CSS as ForgotPassword
import { Link, useNavigate } from "react-router-dom";
import getCsrfToken from '../../hooks/useCsrfToken';

const ResetPassword = () => {
  const [reset_token, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem("resetEmail") || "";

  useEffect(() => {
    if (!email) {
      navigate("/forgot-password");
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      setLoading(true);
    const csrfToken = await getCsrfToken();
      const res = await axios.post('/api/auth/reset-password', {
        email,
        resetToken: reset_token,  // sending as resetToken to match backend param
        newPassword},
      {headers: { 'X-CSRF-Token': csrfToken },
      withCredentials: true }
      );

      setMessage(res.data.message);
      localStorage.removeItem("resetEmail");
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Reset Password</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="Enter Reset Token"
              value={reset_token}
              onChange={(e) => setResetToken(e.target.value)}
              required
            />
          </div>

          <div className="input-box">
            <input
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Resetting..." : "Reset Password"}
          </button>

          {message && <p style={{ color: "green", textAlign: "center" }}>{message}</p>}
          {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

          <div className="register-link">
            <p>
              Remember your password?{" "}
              <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ResetPassword;

