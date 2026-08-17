import httpClient from './httpClient';

// The endpoints added for the admin-portal expansion use the
// { success, data, message } envelope; unwrap `data` here so callers get
// the payload directly, same as the older bare-JSON stats endpoints below.
const unwrap = (r) => r.data.data;

const getUsers = ({ search, role, status, page, pageSize, sortBy, sortDir } = {}) =>
  httpClient.get('/admin/users', { params: { search, role, status, page, pageSize, sortBy, sortDir } }).then(unwrap);

const getUserDetail = (userId) => httpClient.get(`/admin/users/${userId}`).then(unwrap);

const changeUserRole = (userId, role) =>
  httpClient.patch(`/admin/users/${userId}/role`, { role }).then((r) => r.data);

const changeUserStatus = (userId, status, reason) =>
  httpClient.patch(`/admin/users/${userId}/status`, { status, reason }).then((r) => r.data);

const forceLogoutUser = (userId) => httpClient.post(`/admin/users/${userId}/force-logout`).then((r) => r.data);

const verifyUserEmail = (userId) => httpClient.post(`/admin/users/${userId}/verify-email`).then((r) => r.data);

const triggerPasswordReset = (userId) =>
  httpClient.post(`/admin/users/${userId}/trigger-password-reset`).then((r) => r.data);

const getAuditLog = ({ page, pageSize, actorId, action } = {}) =>
  httpClient.get('/admin/audit-log', { params: { page, pageSize, actorId, action } }).then(unwrap);

const getContentOverrides = (status) =>
  httpClient.get('/admin/content', { params: { status } }).then(unwrap);

const upsertContentOverride = ({ tmdbId, mediaType, title, status }) =>
  httpClient.post('/admin/content', { tmdbId, mediaType, title, status }).then(unwrap);

const removeContentOverride = (id) => httpClient.delete(`/admin/content/${id}`).then((r) => r.data);

const getTopShows = () => httpClient.get('/admin/stats/top-shows').then((r) => r.data);

const getMonthlyGrowth = () => httpClient.get('/admin/stats/monthly-growth').then((r) => r.data);

const getHeatmap = () => httpClient.get('/admin/stats/heatmap').then((r) => r.data);

const getOverview = () => httpClient.get('/admin/stats/overview').then((r) => r.data);

const getFunnel = () => httpClient.get('/admin/stats/funnel').then((r) => r.data);

const getRetention = () => httpClient.get('/admin/stats/retention').then((r) => r.data);

const getSessionLength = () => httpClient.get('/admin/stats/session-length').then((r) => r.data);

const adminApi = {
  getUsers,
  getUserDetail,
  changeUserRole,
  changeUserStatus,
  forceLogoutUser,
  verifyUserEmail,
  triggerPasswordReset,
  getAuditLog,
  getContentOverrides,
  upsertContentOverride,
  removeContentOverride,
  getTopShows,
  getMonthlyGrowth,
  getHeatmap,
  getOverview,
  getFunnel,
  getRetention,
  getSessionLength,
};

export default adminApi;
