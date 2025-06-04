import React, { useState } from 'react';
import './Auth.css';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  //const [email, setEmail] = useState('');
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // <-- New state
  const navigate = useNavigate();

 const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const response = await axios.post("/api/auth/login",
      { email, password },
      { withCredentials: true } // <-- this is critical
    );
    const { status, message, data } = response.data;

    if (status === "SUCCESS") {
      alert(message || 'Login successful');
      if (rememberMe) localStorage.setItem("rememberedEmail", email);
      // navigate('/dashboard');
    } else if (message === "Email not verified") {
      alert("Please verify your email before logging in.");
    } else {
      alert(message || 'Login failed');
    }
  } catch (err) {
    alert('Login failed: ' + (err.response?.data?.message || err.message));
  }
};


  return (
    <div className="wrapper">
      <div className="form-box">
        <form onSubmit={handleLogin}>
          <h1>Login</h1>

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
            <Link to="/forgot-password">Forgot Password?</Link>
          </div>

          <button type="submit">Login</button>

          <div className="register-link">
            <p>Don't have an account? <Link to="/register">Register</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;