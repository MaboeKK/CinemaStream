// Imports pages for each route
import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import Login from './pages/LoginPage/Login';
import Register from './pages/RegisterPage/Register';
import VerifyOtp from './pages/VerifyOtpPage/VerifyOtp';
import LandingPage from './pages/LandingPage/LandingPage';
import Home from './pages/home/Home';
import List from './pages/list/list';
import Statistics from './pages/stats/stats';
import New from './pages/new/new';
import './style/dark.scss';
import { DarkModeContext } from './context/darkModeContext';
import HomePage from './pages/HomePage/Home';
import Movies from './pages/MoviePage/Movies';
import Series from './pages/SeriesPage/Series';
import ForgotPassword from './pages/ForgotPasswordPage/ForgotPassword';
import ResetPassword from './pages/ResetPasswordPage/ResetPassword';

import ProtectedRoute from './component/ProtectedRoute';


function App() {
  const { darkMode } = useContext(DarkModeContext);

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <Router>
     
      <Routes>
           <Route path="/HomePage" element={<ProtectedRoute><HomePage /></ProtectedRoute>} />
        <Route path="/Movies" element={<ProtectedRoute><Movies /></ProtectedRoute>} />
        <Route path="/Series" element={<ProtectedRoute><Series /></ProtectedRoute>} />
        
        {/* <Route path="/" element={<Home />} /> */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
            <Route path="/verify-otp" element={<VerifyOtp />} />
          <Route path="/profile" element={<New />} />
          <Route path="/list" element={<List />} />
          <Route path="/stats" element={<Statistics />} />
          <Route path="/product" element={<List />} />
           <Route path="/users" element={<List />} />
          <Route path="/product/single" element={<Single />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
