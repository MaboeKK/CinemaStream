import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Public Pages
import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import VerifyOtp from './pages/VerifyOtpPage/VerifyOtp';
import LandingPage from './pages/LandingPage/LandingPage';
import ForgotPassword from './pages/ForgotPasswordPage/ForgotPassword';
import ResetPassword from './pages/ResetPasswordPage/ResetPassword';
import HomePage from './pages/HomePage/Home';
import Movies from './pages/MoviePage/Movies';
import Series from './pages/SeriesPage/Series';

// Admin Pages
import List from './pages/list/list';
import Statistics from './pages/stats/stats';
import New from './pages/new/new';
import Home from './pages/home/Home';
import './style/dark.scss'; //For dark mode
import { DarkModeContext } from './context/darkModeContext';

import ProtectedRoute from './component/ProtectedRoute';

function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Router>

        {/* Main Application Pages (Protected) */}
        <Routes>
          <Route path="/HomePage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
          <Route path="/Movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
          <Route path="/Series" element={<ProtectedRoute><Series /></ProtectedRoute>} />

          {/* Public Pages */}
          {/* Main Application Pages (Non-Protected) */}
          <Route path="/HomePage" element={<HomePage />} />
          <Route path="/movies" element={<Movies />} />
          <Route path="/series" element={<Series />} />


          {/* User Management */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Admin Pages */}
          {/* User Profile and Statistics */}
          <Route path="/profile" element={<New />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/home" element={<Home />} />

          {/* List Pages */}
          <Route path="/list" element={<List />} />
          <Route path="/product" element={<List />} />
          <Route path="/users" element={<List />} />


          {/* <Route path="/product/single" element={<Single />} /> */}

          {/* Catch-all Route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
   // </div>
  );
}

export default App;
