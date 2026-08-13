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

// Normalizes any rejected request -- a non-2xx response, a request that
// never got a response (network/CORS failure), or a client-side setup error
// -- into one shape every caller can rely on: { message, code, status }.
// Prefers the standardized { error: { code, message } } body; falls back to
// a plain `message` field for endpoints that haven't been migrated to it.
const normalizeError = (error) => {
  if (error.response) {
    const { status, data } = error.response;
    return {
      message: data?.error?.message || data?.message || 'Something went wrong. Please try again.',
      code: data?.error?.code || 'UNKNOWN_ERROR',
      status,
    };
  }

  if (error.request) {
    return {
      message: 'Network error. Please check your connection and try again.',
      code: 'NETWORK_ERROR',
      status: null,
    };
  }

  return {
    message: error.message || 'An unexpected error occurred.',
    code: 'CLIENT_ERROR',
    status: null,
  };
};

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
        return Promise.reject(normalizeError(refreshError));
      }
    }

    return Promise.reject(normalizeError(error));
  }
);

export default httpClient;
