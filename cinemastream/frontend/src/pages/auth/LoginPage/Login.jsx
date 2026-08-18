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
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMessage('');
    try {
      const result = await login(email, password, rememberMe);

      if (rememberMe) localStorage.setItem('rememberedEmail', email);

      const role = result.data.role;

      // The awaited login() response is itself the real signal: the
      // browser has already applied the Set-Cookie headers from that
      // response before the promise resolved, so there's nothing left
      // to wait out with a fixed delay.
      if (role === 'admin' || role === 'super_admin') {
        navigate('/admin');
      } else if (role === 'guest') {
        navigate('/home');
      } else {
        navigate('/'); // fallback
      }
    } catch (err) {
      if (err.code === 'EMAIL_NOT_VERIFIED') {
        navigate('/verify-otp');
      } else {
        setErrorMessage(err.message || 'Login failed. Please try again.');
      }
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

        {errorMessage && (
          <p style={{ color: 'var(--color-accent)', fontSize: '0.9rem', marginBottom: '10px' }}>
            {errorMessage}
          </p>
        )}

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
