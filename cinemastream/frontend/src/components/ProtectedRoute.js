// src/components/ProtectedRoute.js
import React, { useRef } from 'react';
import { Navigate } from 'react-router-dom';
import useAuthCheck from '../hooks/useAuthCheck';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
  const status = useAuthCheck();
  const hasToasted = useRef(false);

  if (status === 'loading') return <p>Loading...</p>;

  if (status === 'unauthenticated') {
    if (!hasToasted.current) {
      toast.warning("Please login first");
      hasToasted.current = true;
    }
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;
