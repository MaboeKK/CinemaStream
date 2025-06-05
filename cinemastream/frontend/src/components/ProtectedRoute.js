import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const location = useLocation();
  const [authStatus, setAuthStatus] = useState('loading'); // 'loading', 'authenticated', 'unauthenticated', 'unverified'

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await axios.get('/api/auth/check-auth', {
          withCredentials: true,
          headers: {
            'x-csrf-token': getCookie('csrf_token'),
          },
        });

        if (res.data.user?.verified) {
          setAuthStatus('authenticated');
        } else {
          setAuthStatus('unverified');
          toast.warn('Please verify your email to continue.');
        }
      } catch (err) {
        console.error(err);
        toast.error('Unauthorized access. Please log in.');
        setAuthStatus('unauthenticated');
      }
    };

    checkAuth();
  }, []);

  const getCookie = (name) => {
    const cookie = document.cookie
      .split('; ')
      .find((row) => row.startsWith(name + '='));
    return cookie?.split('=')[1];
  };

  if (authStatus === 'loading') return <p>Loading...</p>;

  if (authStatus === 'unauthenticated')
    return <Navigate to="/login" state={{ from: location }} replace />;

  if (authStatus === 'unverified')
    return <Navigate to="/verify-otp" state={{ from: location }} replace />;

  return children;
};

export default ProtectedRoute;
