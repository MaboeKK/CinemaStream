import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import VerifyOtp from './pages/VerifyOtpPage/VerifyOtp';
import LandingPage from './pages/LandingPage/LandingPage';
import Home from './pages/HomePage/Home';
import Movies from './pages/MoviePage/Movies';
import Series from './pages/SeriesPage/Series';
import ForgotPassword from './pages/ForgotPasswordPage/ForgotPassword';
import ResetPassword from './pages/ResetPasswordPage/ResetPassword';

// import ProtectedRoute from './components/ProtectedRoute';


function App() {
  return (
    <Router>
      {/* Toasts for errors, success messages, etc */}
      {/* <ToastContainer position="top-right" autoClose={3000} /> */}

      <Routes>
        {/* <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        <Route path="/Movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
        <Route path="/Series" element={<ProtectedRoute><Series /></ProtectedRoute>} /> */}

        <Route path="/Home" element={<Home />} />
        <Route path="/Movies" element={<Movies />} />
        <Route path="/Series" element={<Series />} />
        
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
