import React, { useState } from "react";
import { MdEmail } from "react-icons/md";
import { FaLock } from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "./Auth.css";

const Login = ({ closeModal, openRegisterModal, openForgotPasswordModal }) => {
  const [email, setEmail] = useState(() => localStorage.getItem("rememberedEmail") || "");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false); // ✅ loading state
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // ✅ Start loading

    try {
      const response = await axios.post(
        "/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      const { status, message } = response.data;

      if (status === "SUCCESS") {
        toast.success(message || "Login successful");

        if (rememberMe) {
          localStorage.setItem("rememberedEmail", email);
        }

        closeModal(); // Close popup modal

        setTimeout(() => {
          navigate("/home"); // ✅ Use navigate instead of window.location.href
        }, 500);
      } else if (message === "Please verify your email to login") {
        toast.warn("Please verify your email.");
        navigate("/verify-otp");
      } else {
        toast.error(message || "Login failed");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false); // ✅ End loading
    }
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (openForgotPasswordModal) {
      openForgotPasswordModal();
    } else {
      navigate("/forgot-password");
    }
  };

  return (
    <div className="auth-page">
      <div className="wrapper">
        <div className="form-box">
          <form onSubmit={handleLogin}>
            <h1>Login</h1>

            {/* ✅ Show loading indicator */}
            {loading && (
              <p style={{ textAlign: "center", color: "gray", marginBottom: "10px" }}>
                Please wait...
              </p>
            )}

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
                  textDecoration: "underline",
                }}
              >
                Forgot Password?
              </span>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>

            <div className="register-link">
              <p>
                Don't have an account?{" "}
                <span
                  className="link"
                  style={{ color: "blue", cursor: "pointer" }}
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
