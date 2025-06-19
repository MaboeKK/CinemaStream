import React, { useState } from 'react';
import './Auth.css';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify'
import getCsrfToken from '../../hooks/useCsrfToken';;

const Login = () => {
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false); // <-- New state
  const navigate = useNavigate();

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const csrfToken = await getCsrfToken();
    const response = await axios.post('/api/auth/login',
      { email, password, rememberMe },
       {headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
    );

    const { status, message, data, csrfToken: newCsrfToken } = response.data;

    if (status === "SUCCESS") {
  toast.success(message || 'Login successful');
  if (rememberMe) localStorage.setItem("rememberedEmail", email);
  setTimeout(() => {
    navigate('/Home');
  }, 500); // wait 0.5s for cookies to sync
}
 else if (message === "Please verify your email to login") {
      toast.warn("Please verify your email.");
      navigate('/verify-otp');
    } else {
      toast.error(message || 'Login failed');
    }
  } catch (err) {
    toast.error(err.response?.data?.message || err.message);
  }
};

  return (
     <div className="auth-page">
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
    </div>
  );
};

export default Login;
