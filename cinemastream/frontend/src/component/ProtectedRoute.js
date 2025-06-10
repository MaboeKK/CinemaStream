import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

   const checkAuth = async () => {
      try {
        await axios.get('/api/auth/check-auth', {
          withCredentials: true,
        });
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
      }
    };

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    const intervalId = setInterval(checkAuth, 1000);
    return () => clearInterval(intervalId);
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
