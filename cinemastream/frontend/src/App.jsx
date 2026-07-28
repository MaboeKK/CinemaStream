import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import muiTheme from './theme/muiTheme';
import { AuthProvider } from './context/AuthContext';
import { DarkModeProvider } from './context/DarkModeContext';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './pages/auth/LoginPage/Login';
import Register from './pages/auth/RegisterPage/Register';
import VerifyOtp from './pages/auth/VerifyOtpPage/VerifyOtp';
import ForgotPassword from './pages/auth/ForgotPasswordPage/ForgotPassword';
import ResetPassword from './pages/auth/ResetPasswordPage/ResetPassword';
import LandingPage from './pages/LandingPage/LandingPage';
import HomePage from './pages/catalog/HomePage/HomePage';
import MoviesPage from './pages/catalog/MoviesPage/MoviesPage';
import SeriesPage from './pages/catalog/SeriesPage/SeriesPage';
import MyListPage from './pages/catalog/MyListPage/MyListPage';
import DashboardPage from './pages/admin/DashboardPage/DashboardPage';
import UsersPage from './pages/admin/UsersPage/UsersPage';
import StatsPage from './pages/admin/StatsPage/StatsPage';

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <DarkModeProvider>
          <Router>
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/verify-otp" element={<VerifyOtp />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />

              <Route
                path="/Homepage"
                element={
                  <ProtectedRoute>
                    <HomePage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/movies"
                element={
                  <ProtectedRoute>
                    <MoviesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/series"
                element={
                  <ProtectedRoute>
                    <SeriesPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/my-list"
                element={
                  <ProtectedRoute>
                    <MyListPage />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/home"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/users"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <UsersPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin/stats"
                element={
                  <ProtectedRoute roles={['admin']}>
                    <StatsPage />
                  </ProtectedRoute>
                }
              />

              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Router>
        </DarkModeProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
