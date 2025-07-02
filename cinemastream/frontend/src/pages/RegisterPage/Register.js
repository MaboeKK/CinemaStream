
import React, { useState } from 'react';
import './Auth.css';
import { MdEmail } from 'react-icons/md';
import { FaLock, FaUser } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import getCsrfToken from '../../hooks/useCsrfToken';

const Register = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate();

  const passwordsMatch = password === confirmPassword;

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match');
      setLoading(false); 
      return;
    }

    try {
      const csrfToken = await getCsrfToken();
      const response = await axios.post(
        '/api/auth/register',
        { first_name, last_name, email, password },
        { headers: { 'X-CSRF-Token': csrfToken }, withCredentials: true }
      );

      const { status, message } = response.data;

      if (status === 'SUCCESS') {
        toast.success(
          <div>
            <p>Registration successful!</p>
            <p>Please verify your email to login.</p>
          </div>
        );
        navigate('/verify-otp', { state: { email } });
      } else {
        setErrorMessage(message || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage(
        err.response?.data?.message || 'Registration failed: ' + err.message
      );
    } finally {
      setLoading(false); 
    }
  };
  
  return (
     <div className="auth-page">
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
              disabled={loading} 
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
              disabled={loading} 
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
              disabled={loading} 
            />
            <MdEmail className="icon" />
          </div>

          <div className="input-box">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading} 
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
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading} 
            />
            <FaLock className="icon" />
            <span className="toggle-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          {confirmPassword && (
            <p
              style={{
                color: passwordsMatch ? 'green' : 'red',
                marginBottom: '10px',
                fontSize: '0.9rem',
              }}
            >
              {passwordsMatch ? 'Passwords match' : 'Passwords do not match'}
            </p>
          )}

          {errorMessage && (
            <p style={{ color: 'red', fontSize: '0.9rem', marginBottom: '10px' }}>
              {errorMessage}
            </p>
          )}

          <button type="submit" disabled={!passwordsMatch}>
            Register
          </button>

          <div className="register-link">
            <p>
              Already have an account? <Link to="/login">Login</Link>
            </p>
          </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default Register;