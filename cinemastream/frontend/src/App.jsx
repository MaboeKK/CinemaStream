import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import muiTheme from './theme/muiTheme';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Login from './pages/auth/LoginPage/Login';
import Register from './pages/auth/RegisterPage/Register';
import VerifyOtp from './pages/auth/VerifyOtpPage/VerifyOtp';
import ForgotPassword from './pages/auth/ForgotPasswordPage/ForgotPassword';
import ResetPassword from './pages/auth/ResetPasswordPage/ResetPassword';
import LandingPage from './pages/marketing/LandingPage/LandingPage';
import HomePage from './pages/catalog/HomePage/HomePage';
import MoviesPage from './pages/catalog/MoviesPage/MoviesPage';
import SeriesPage from './pages/catalog/SeriesPage/SeriesPage';
import MyListPage from './pages/catalog/MyListPage/MyListPage';
import WatchPage from './pages/catalog/WatchPage/WatchPage';
import SeriesDetailPage from './pages/catalog/SeriesDetailPage/SeriesDetailPage';
import DashboardPage from './pages/admin/DashboardPage/DashboardPage';
import UsersPage from './pages/admin/UsersPage/UsersPage';
import UserDetailPage from './pages/admin/UserDetailPage/UserDetailPage';
import StatsPage from './pages/admin/StatsPage/StatsPage';
import AuditLogPage from './pages/admin/AuditLogPage/AuditLogPage';
import ContentPage from './pages/admin/ContentPage/ContentPage';

const ADMIN_ROLES = ['admin', 'super_admin'];

function AppRoutes() {
  const location = useLocation();
  return (
    <div key={location.pathname} className="page-transition">
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-otp" element={<VerifyOtp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route
          path="/home"
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
          path="/watch/movie/:id"
          element={
            <ProtectedRoute>
              <WatchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watch/tv/:id"
          element={
            <ProtectedRoute>
              <SeriesDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/watch/tv/:id/:season/:episode"
          element={
            <ProtectedRoute>
              <WatchPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            <ProtectedRoute roles={ADMIN_ROLES}>
              <DashboardPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users"
          element={
            <ProtectedRoute roles={ADMIN_ROLES}>
              <UsersPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/users/:id"
          element={
            <ProtectedRoute roles={ADMIN_ROLES}>
              <UserDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/stats"
          element={
            <ProtectedRoute roles={ADMIN_ROLES}>
              <StatsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/audit-log"
          element={
            <ProtectedRoute roles={ADMIN_ROLES}>
              <AuditLogPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/content"
          element={
            <ProtectedRoute roles={ADMIN_ROLES}>
              <ContentPage />
            </ProtectedRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
      <ToastContainer position="bottom-right" theme="dark" />
    </ThemeProvider>
  );
}

export default App;
