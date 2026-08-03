import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/auth/AuthLayout';
import authApi from '../../../api/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage('');

    try {
      await authApi.forgotPassword(email);

      // Save email for reset password page
      localStorage.setItem('resetEmail', email);

      // The awaited request having resolved is the real "OTP sent" signal --
      // no need to also wait out a fixed delay before moving on.
      navigate('/reset-password');
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Request failed. Please try again.');
    }
  };

  return (
    <AuthLayout>
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

        {errorMessage && (
          <p style={{ color: 'var(--color-accent)', fontSize: '0.9rem', marginBottom: '10px' }}>
            {errorMessage}
          </p>
        )}

        <button type="submit" className="btn-primary">
          Send OTP
        </button>

        <div className="register-link">
          <p>
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ForgotPassword;
