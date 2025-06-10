import React, { useState, useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify'

const ProtectedRoute = ({ children }) => {
  const [isAuth, setIsAuth] = useState(null);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        await axios.get('/api/auth/check-auth', {
          withCredentials: true,
        });
        setIsAuth(true);
      } catch (error) {
        setIsAuth(false);
        toast.error("Please login first");
      }
    };

    checkAuth();
  }, []);

  if (isAuth === null) return <div>Loading...</div>;
  if (!isAuth) return <Navigate to="/login" replace />;
  return children;
};

export default ProtectedRoute;
