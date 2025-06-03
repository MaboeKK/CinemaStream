import React, { useState } from 'react';
import './Auth.css';
import { MdEmail } from 'react-icons/md';
import { FaLock, FaUser } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';

const Register = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
    setPasswordMatch(e.target.value === confirmPassword);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
    setPasswordMatch(password === e.target.value);
  };

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!passwordMatch) {
      alert('Passwords do not match');
      return;
    }

    try {
      const response = await axios.post("http://45.220.164.64:5000/api/auth/signup", {
        first_name,
        last_name,
        email,
        password
      });

      const { status, message } = response.data;

      if (status === 'SUCCESS') {
        alert(message);
        navigate('/verify-otp', { state: { email } });
      } else {
        alert(message || 'Registration failed');
      }
    } catch (err) {
      alert('Registration failed: ' + (err.response?.data?.message || err.message));
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        <form onSubmit={handleRegister}>
          <h1>Register</h1>

          <div className="input-box">
            <input
              type="text"
              placeholder="First Name"
              required
              value={first_name}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

          <div className="input-box">
            <input
              type="text"
              placeholder="Last Name"
              required
              value={last_name}
              onChange={(e) => setLastName(e.target.value)}
            />
            <FaUser className="icon" />
          </div>

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
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={password}
              onChange={handlePasswordChange}
            />
            <FaLock className="icon" />
            <span className="toggle-password" onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          <div className="input-box">
            <input
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
            />
            <FaLock className="icon" />
            <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          {confirmPassword && (
            <p style={{ color: passwordMatch ? 'green' : 'red', marginBottom: '10px', fontSize: '0.9rem' }}>
              {passwordMatch ? 'Passwords match' : 'Passwords do not match'}
            </p>
          )}

          <button type="submit" disabled={!passwordMatch}>Register</button>

          <div className="register-link">
            <p>Already have an account? <Link to="/login">Login</Link></p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
