import React, { useState } from 'react';
import './Auth.css'; // Styles for the form
import { MdEmail } from 'react-icons/md'; // Email icon
import { FaLock, FaUser } from 'react-icons/fa'; // Lock and User icons
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai'; // Eye icons for toggling password visibility
import axios from 'axios'; // For HTTP requests
import { useNavigate } from 'react-router-dom'; // To programmatically navigate between routes

// Register component with props to close modal or open login modal
const Register = ({ closeModal, openLoginModal }) => {
  // State variables for user input and UI behavior
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false); 

  const navigate = useNavigate(); // React Router hook for navigation

  // Check if password and confirm password match
  const passwordsMatch = password === confirmPassword;

  // Handle form submission
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevent page reload
    setLoading(true); // 

    if (!passwordsMatch) {
      setErrorMessage('Passwords do not match');
      setLoading(false); 
      return;
    }

    // Clear any previous error messages
    setErrorMessage('');

    try {
      // Send POST request to backend registration endpoint
      const response = await axios.post(`/api/auth/register`, {
        first_name,
        last_name,
        email,
        password,
      });

      const { status, message } = response.data;

      if (status === 'SUCCESS') {
        // If registration successful, show alert and navigate to OTP verification
        alert(message);
        navigate('/verify-otp', { state: { email } });
      } else {
        setErrorMessage(message || 'Registration failed');
      }
    } catch (err) {
      // Handle server or network errors
      setErrorMessage(
        err.response?.data?.message || 'Registration failed: ' + err.message
      );
    } finally {
      setLoading(false); 
    }
  };

  return (
    <div className="wrapper">
      <div className="form-box">
        <form onSubmit={handleRegister}>
          <h1>Register</h1>

          {/*  Show loading indicator */}
          {loading && (
            <p style={{ textAlign: "center", color: "gray", marginBottom: "10px" }}>
              Please wait...
            </p>
          )}

          {/* First Name Input */}
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

          {/* Last Name Input */}
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

          {/* Email Input */}
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

          {/* Password Input with Toggle Visibility */}
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
            <span
              className="toggle-password"
              onClick={() => !loading && setShowPassword(!showPassword)} 
              style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.5 : 1 }}
            >
              {showPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          {/* Confirm Password Input with Toggle Visibility */}
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
            <span
              className="toggle-password"
              onClick={() => !loading && setShowConfirmPassword(!showConfirmPassword)} //  Disable toggle during loading
              style={{ pointerEvents: loading ? 'none' : 'auto', opacity: loading ? 0.5 : 1 }}
            >
              {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
            </span>
          </div>

          {/* Password Match Validation Message */}
          {confirmPassword && !loading && (
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

          {/* Error Message Display */}
          {errorMessage && (
            <p
              style={{
                color: 'red',
                fontSize: '0.9rem',
                marginBottom: '10px',
              }}
            >
              {errorMessage}
            </p>
          )}

          {/* Submit Button - disabled if passwords don't match or loading */}
          <button type="submit" disabled={!passwordsMatch || loading}>
            {loading ? "Registering..." : "Register"}
          </button>

          {/* Link to Sign In Modal */}
          <div className="register-link">
            <p>
              Already have an account?{' '}
              <span
                className="link"
                style={{ 
                  color: loading ? 'gray' : 'blue', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  pointerEvents: loading ? 'none' : 'auto'
                }}
                onClick={() => !loading && openLoginModal()}
              >
                Sign In
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;