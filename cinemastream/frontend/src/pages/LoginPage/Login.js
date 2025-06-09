import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import "./Auth.css";

// Login component handles user authentication and modal navigation
const Login = ({ closeModal, openRegisterModal, openForgotPasswordModal }) => {
  // State to store email input. Pre-filled with remembered email if available.
  const [email, setEmail] = useState(
    () => localStorage.getItem("rememberedEmail") || ""
  );

  // State to store password input
  const [password, setPassword] = useState("");

  // State to track "Remember me" checkbox
  const [rememberMe, setRememberMe] = useState(false);

  // Handle form submission and login logic
  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      // Send login request to the backend
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true } // Include cookies for session handling
      );

      const { status, message } = response.data;

      if (status === "SUCCESS") {
        toast.success(message || "Login successful");

        // Save email locally if "Remember me" is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        }

        // Close the modal and redirect to home page
        closeModal();
        setTimeout(() => {
          window.location.href = "/home";
        }, 500);

      } else if (message === "Please verify your email to login") {
        toast.warn("Please verify your email.");
        window.location.href = "/verify-otp";
      } else {
        toast.error(message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // Handle "Forgot Password" link click
  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (openForgotPasswordModal) {
      // Open modal if function provided
      openForgotPasswordModal();
    } else {
      // Fallback: navigate to forgot-password page
      window.location.href = "/forgot-password";
    }
  };


  return (
    <div className="auth-page">
      <div className="wrapper">
        <div className="form-box">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>

            {/* Email input field */}
            <div className="input-box">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <MdEmail className="icon" />
            </div>

            {/* Password input field */}
            <div className="input-box">
              <input
                type="password"
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FaLock className="icon" />
            </div>

            {/* Remember me checkbox and forgot password link */}
            <div className="remember-forgot">
              <label>
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember me
              </label>
              <span 
                onClick={handleForgotPassword}
                style={{ 
                  color: "#e50914", 
                  cursor: "pointer",
                  textDecoration: "underline" 
                }}
              >
                Forgot Password?
              </span>
            </div>

            {/* Submit login button */}
            <button type="submit">Login</button>

            {/* Link to open register modal */}
            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <span
                  className="link"
                  style={{ color: 'blue', cursor: 'pointer' }}
                  onClick={openRegisterModal}
                >
                  Register
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;