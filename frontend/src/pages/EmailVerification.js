import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import './Auth.css'; // Optional, reuse your auth styles

const EmailVerification = () => {
  const [status, setStatus] = useState('');
  const [message, setMessage] = useState('');
  const [searchParams] = useSearchParams();

  useEffect(() => {
    const statusParam = searchParams.get('status');

    setStatus(statusParam);

    switch (statusParam) {
      case 'success':
        setMessage('✅ Your email has been verified successfully.');
        break;
      case 'already-verified':
        setMessage('⚠️ Your email was already verified.');
        break;
      case 'invalid':
        setMessage('❌ Invalid or expired verification link.');
        break;
      case 'error':
        setMessage('🚫 An error occurred during verification. Please try again later.');
        break;
      default:
        setMessage('...');
        break;
    }
  }, [searchParams]);

  return (
    <div className="auth-container">
      <div className="auth-box">
        <h2>Email Verification</h2>
        <p>{message}</p>
      </div>
    </div>
  );
};

export default EmailVerification;