import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../../../components/AuthLayout';
import authApi from '../../../api/authApi';
import { getPasswordError } from '../../../utils/validators';

const ResetPassword = () => {
  const [reset_token, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const email = localStorage.getItem('resetEmail') || '';

  useEffect(() => {
    if (!email) {
      navigate('/forgot-password');
    }
  }, [email, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const passwordError = getPasswordError(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    try {
      setLoading(true);
      await authApi.resetPassword(email, reset_token, newPassword);

      toast.success(
        <div>
          <p>Password reset successful!</p>
          <p>You will be redirected to the login page shortly.</p>
        </div>
      );
      localStorage.removeItem('resetEmail');
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
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
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>

        {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}

        <div className="register-link">
          <p>
            Remember your password? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default ResetPassword;
