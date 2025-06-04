import React, { useState } from "react";
import axios from "axios";
import "./Auth.css"; // Your CSS file
import { Link, useNavigate } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const res = await axios.post(`/api/auth/forgot-password`, {
        email,
      });
      setMessage(res.data.message);

      // Save email for reset password page
      localStorage.setItem("resetEmail", email);

      // Redirect after short delay to reset password page
      setTimeout(() => {
        navigate("/reset-password");
      }, 1500);
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="auth-page">
      <div className="wrapper">
        <form onSubmit={handleSubmit}>
          <h1>Forgot Password</h1>

          <div className="input-box">
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit">Send OTP</button>

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

export default ForgotPassword;
