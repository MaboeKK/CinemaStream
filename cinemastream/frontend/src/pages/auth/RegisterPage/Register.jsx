import React, { useState } from 'react';
import { MdEmail } from 'react-icons/md';
import { FaLock, FaUser } from 'react-icons/fa';
import { AiFillEye, AiFillEyeInvisible } from 'react-icons/ai';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthLayout from '../../../components/auth/AuthLayout';
import authApi from '../../../api/authApi';
import { passwordsMatch, isValidPassword, getPasswordError } from '../../../utils/validators';

const Register = () => {
  const [first_name, setFirstName] = useState('');
  const [last_name, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const navigate = useNavigate();

  const doPasswordsMatch = passwordsMatch(password, confirmPassword);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!doPasswordsMatch) {
      setErrorMessage('Passwords do not match');
      return;
    }

    if (!isValidPassword(password)) {
      setErrorMessage(getPasswordError(password));
      return;
    }

    try {
      const result = await authApi.register({ first_name, last_name, email, password });

      if (result.status === 'SUCCESS') {
        toast.success(
          <div>
            <p>Registration successful!</p>
            <p>Please verify your email to login.</p>
          </div>
        );
        navigate('/verify-otp', { state: { email } });
      } else {
        setErrorMessage(result.message || 'Registration failed');
      }
    } catch (err) {
      setErrorMessage(err.response?.data?.message || 'Registration failed: ' + err.message);
    }
  };

  return (
    <AuthLayout>
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
            onChange={(e) => setPassword(e.target.value)}
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
          />
          <FaLock className="icon" />
          <span
            className="toggle-password"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
          >
            {showConfirmPassword ? <AiFillEyeInvisible /> : <AiFillEye />}
          </span>
        </div>

        {confirmPassword && (
          <p
            style={{
              color: doPasswordsMatch ? 'var(--color-success)' : 'var(--color-accent)',
              marginBottom: '10px',
              fontSize: '0.9rem',
            }}
          >
            {doPasswordsMatch ? 'Passwords match' : 'Passwords do not match'}
          </p>
        )}

        {errorMessage && (
          <p style={{ color: 'var(--color-accent)', fontSize: '0.9rem', marginBottom: '10px' }}>
            {errorMessage}
          </p>
        )}

        <button type="submit" className="btn-primary" disabled={!doPasswordsMatch}>
          Register
        </button>

        <div className="register-link">
          <p>
            Already have an account? <Link to="/login">Login</Link>
          </p>
        </div>
      </form>
    </AuthLayout>
  );
};

export default Register;
