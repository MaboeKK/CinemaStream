import React, { useState } from 'react';
import { FaLock } from 'react-icons/fa';
import { MdEmail } from 'react-icons/md';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/auth/AuthLayout';
import { useAuth } from '../../../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState(() => localStorage.getItem('rememberedEmail') || '');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(email, password, rememberMe);

      if (result.status === 'SUCCESS') {
        if (rememberMe) localStorage.setItem('rememberedEmail', email);

        const role = result.data.role;

        setTimeout(() => {
          if (role === 'admin') {
            navigate('/home');
          } else if (role === 'guest') {
            navigate('/Homepage');
          } else {
            navigate('/'); // fallback
          }
        }, 500); // wait 0.5s for cookies to sync
      } else if (result.message === 'Please verify your email to login') {
        navigate('/verify-otp');
      }
    } catch {
      // Login failed -- form stays as-is; no toast/error UI per current design.
    }
  };

  return (
    <AuthLayout>
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

        <button type="submit" className="btn-primary">
          Login
        </button>

        <div className="register-link">
          <p>
            Don&apos;t have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Login;
