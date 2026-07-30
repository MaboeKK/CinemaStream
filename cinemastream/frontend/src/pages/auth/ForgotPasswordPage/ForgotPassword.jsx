import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AuthLayout from '../../../components/auth/AuthLayout';
import authApi from '../../../api/authApi';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await authApi.forgotPassword(email);

      // Save email for reset password page
      localStorage.setItem('resetEmail', email);

      // Redirect after short delay to reset password page
      setTimeout(() => {
        navigate('/reset-password');
      }, 1500);
    } catch {
      // Request failed -- no toast/error UI per current design.
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
