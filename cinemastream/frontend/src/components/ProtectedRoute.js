//src/components/ProtectedRoute.js
import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthCheck from '../hooks/useAuthCheck';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const status = useAuthCheck();

  if (status === 'loading') return <p>Loading...</p>; // Or a spinner

  if (status === 'unauthenticated') {
    toast.warning("Please log in first.");
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

