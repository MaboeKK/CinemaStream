import React, { useState } from 'react';
import './Auth.css';
import { MdEmail } from 'react-icons/md';
import { FaLock } from 'react-icons/fa';
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';

const VerifyOtp = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialEmail = location.state?.email || '';
  const [email, setEmail] = useState(initialEmail);
  const [otp, setOtp] = useState('');

  const handleOtpVerification = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
  'http://45.220.164.64:5000/api/auth/verify-otp',
  { email, otp },
  { withCredentials: true }
);

      const { status, message } = response.data;

      if (status === "SUCCESS") {
        alert('Verification successful!');
        navigate('/login');
      } else {
        alert(message || 'Verification failed');
      }
    } catch (err) {
      alert('Error verifying OTP: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
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
          <button type="submit">Verify</button>
          <div className="register-link">
            <p>Back to <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;
