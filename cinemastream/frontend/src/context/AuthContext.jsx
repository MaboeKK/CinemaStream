import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import authApi from '../api/authApi';

const AuthContext = createContext(undefined);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = useCallback(async () => {
    try {
      const { user: authenticatedUser } = await authApi.checkAuth();
      setUser(authenticatedUser);
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuth();

    // Raised by httpClient when a request 401s and the refresh-token retry
    // also fails -- the session is gone, so drop it here too.
    const handleSessionExpired = () => setUser(null);
    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [checkAuth]);

  const login = useCallback(async (email, password, rememberMe) => {
    const result = await authApi.login(email, password, rememberMe);
    if (result.status === 'SUCCESS') {
      setUser(result.data);
    }
    return result;
  }, []);

  const logout = useCallback(async () => {
    try {
      await authApi.logout();
    } finally {
      setUser(null);
    }
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      loading,
      login,
      logout,
      refreshAuth: checkAuth,
    }),
    [user, loading, login, logout, checkAuth]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
