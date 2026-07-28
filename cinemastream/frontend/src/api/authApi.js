import httpClient from './httpClient';

// Every function here resolves with response.data as-is (not throwing on a
// "FAILED" business outcome) so existing callers can keep branching on
// data.status / data.message exactly like before. Network/CSRF/5xx errors
// still reject normally and should be handled with try/catch.

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
