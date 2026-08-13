import httpClient from './httpClient';

// Every function here resolves with response.data on success (2xx) and
// rejects on any other outcome -- httpClient's response interceptor
// normalizes the rejection to { message, code, status }, so callers handle
// failures with try/catch instead of checking a body field.

const login = (email, password, rememberMe) =>
  httpClient.post('/auth/login', { email, password, rememberMe }).then((r) => r.data);

const register = ({ first_name, last_name, email, password }) =>
  httpClient.post('/auth/register', { first_name, last_name, email, password }).then((r) => r.data);

const verifyOtp = (email, otp) =>
  httpClient.post('/auth/verify-otp', { email, otp }).then((r) => r.data);

const resendOtp = (email) => httpClient.post('/auth/resend-otp', { email }).then((r) => r.data);

const forgotPassword = (email) =>
  httpClient.post('/auth/forgot-password', { email }).then((r) => r.data);

const resetPassword = (email, resetToken, newPassword) =>
  httpClient.post('/auth/reset-password', { email, resetToken, newPassword }).then((r) => r.data);

const logout = () => httpClient.post('/auth/logout').then((r) => r.data);

const checkAuth = () => httpClient.get('/auth/check-auth').then((r) => r.data);

const authApi = {
  login,
  register,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  logout,
  checkAuth,
};

export default authApi;
