import axios from 'axios';

// Endpoints excluded from the auto refresh-and-retry logic below: a 401 from
// any of these is an expected outcome (e.g. "not logged in yet"), not a
// signal that a previously-valid session just expired.
const AUTH_FLOW_PATHS = [
  '/auth/login',
  '/auth/register',
  '/auth/refresh-token',
  '/auth/check-auth',
];

const httpClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

let cachedCsrfToken = null;

const fetchCsrfToken = async () => {
  const { data } = await httpClient.get('/auth/csrf-token');
  cachedCsrfToken = data.csrfToken;
  return cachedCsrfToken;
};

const MUTATING_METHODS = ['post', 'put', 'patch', 'delete'];

httpClient.interceptors.request.use(async (config) => {
  const method = (config.method || '').toLowerCase();
  if (MUTATING_METHODS.includes(method) && !config.skipCsrf) {
    const token = await fetchCsrfToken();
    config.headers['X-CSRF-Token'] = token;
  }
  return config;
});

httpClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    const isAuthFlowRequest = AUTH_FLOW_PATHS.some((path) => originalRequest?.url?.includes(path));

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !isAuthFlowRequest
    ) {
      originalRequest._retry = true;
      try {
        await httpClient.post('/auth/refresh-token', {}, { skipCsrf: true });
        return httpClient(originalRequest);
      } catch (refreshError) {
        window.dispatchEvent(new Event('auth:session-expired'));
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default httpClient;
