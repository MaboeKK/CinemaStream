import React, { useState, useEffect } from 'react';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../../../components/AuthLayout';
import authApi from '../../../api/authApi';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes countdown
  const [resendAvailable, setResendAvailable] = useState(false);

  // Countdown logic
  useEffect(() => {
    if (timeLeft <= 0) {
      setResendAvailable(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    try {
      const result = await authApi.verifyOtp(email, otp);

      if (result.status === 'SUCCESS') {
        toast.success(
          <div>
            <p>Verification successful!</p>
            <p>You will be redirected to the login page shortly.</p>
          </div>
        );
        navigate('/login');
      } else {
        toast.error(result.message || 'Verification failed');
      }
    } catch (err) {
      toast.error('Error verifying OTP: ' + (err.response?.data?.message || err.message));
    }
  };

  const handleResendOtp = async () => {
    try {
      const result = await authApi.resendOtp(email);
      toast.success(result.message || 'OTP resent');
      setTimeLeft(180);
      setResendAvailable(false);
    } catch (err) {
      toast.error('Failed to resend OTP: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <AuthLayout>
      <form onSubmit={handleOtpVerification}>
        <h1>Verify OTP</h1>
        <div className="input-box">
          <input
            type="email"
            placeholder="Enter your email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <MdEmail className="icon" />
        </div>
        <div className="input-box">
          <input
            type="text"
            placeholder="Enter OTP"
            required
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <FaLock className="icon" />
        </div>
        <p>Time remaining: {formatTime(timeLeft)}</p>
        <button type="submit" disabled={timeLeft <= 0}>
          Verify
        </button>

        {resendAvailable && (
          <div className="resend-section">
            <p>Didn&apos;t receive OTP?</p>
            <button type="button" onClick={handleResendOtp}>
              Resend OTP
            </button>
          </div>
        )}

        <div className="register-link">
          <p>
            Back to <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default VerifyOtp;
