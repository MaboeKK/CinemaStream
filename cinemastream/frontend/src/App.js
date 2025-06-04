// Imports pages for each route
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import VerifyOtp from './pages/VerifyOtpPage/VerifyOtp';
import LandingPage from './pages/LandingPage/LandingPage';
<<<<<<< HEAD
import Home from './pages/HomePage/Home';
import Movies from './pages/MoviePage/Movies';
import Series from './pages/SeriesPage/Series';
=======
import ForgotPassword from './pages/ForgotPasswordPage/ForgotPassword';
import ResetPassword from './pages/ResetPasswordPage/ResetPassword';


>>>>>>> origin/develop

function App() {
  return (
    <Router>
      <Routes>
      <Route path="/" element={< Home/>} />
      <Route path="/Movies" element={< Movies/>} />
      <Route path="/Series" element={< Series/>} />
        <Route path="/LandingPage" element={<LandingPage />} />
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

