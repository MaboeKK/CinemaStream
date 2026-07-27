import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Login from './pages/auth/LoginPage/Login';
import Register from './pages/auth/RegisterPage/Register';
import VerifyOtp from './pages/auth/VerifyOtpPage/VerifyOtp';
import ForgotPassword from './pages/auth/ForgotPasswordPage/ForgotPassword';
import ResetPassword from './pages/auth/ResetPasswordPage/ResetPassword';
import LandingPage from './pages/LandingPage/LandingPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <ToastContainer position="top-right" autoClose={3000} />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
