import httpClient from './httpClient';

const getUsers = () => httpClient.get('/admin/users').then((r) => r.data);

const getTopShows = () => httpClient.get('/admin/stats/top-shows').then((r) => r.data);

const getMonthlyGrowth = () => httpClient.get('/admin/stats/monthly-growth').then((r) => r.data);

const getHeatmap = () => httpClient.get('/admin/stats/heatmap').then((r) => r.data);

const getOverview = () => httpClient.get('/admin/stats/overview').then((r) => r.data);

const adminApi = { getUsers, getTopShows, getMonthlyGrowth, getHeatmap, getOverview };

export default adminApi;
