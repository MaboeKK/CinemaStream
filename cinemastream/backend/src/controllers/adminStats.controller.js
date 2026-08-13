const asyncHandler = require('../utils/asyncHandler');
const adminStatsService = require('../services/adminStats.service');
const { sendSuccess } = require('../utils/response');

const topShows = asyncHandler(async (req, res) => {
  const rows = await adminStatsService.getTopShows();
  sendSuccess(res, { data: rows, message: 'Top shows retrieved' });
});

const monthlyGrowth = asyncHandler(async (req, res) => {
  const rows = await adminStatsService.getMonthlyUserGrowth();
  sendSuccess(res, { data: rows, message: 'Monthly growth retrieved' });
});

const heatmap = asyncHandler(async (req, res) => {
  const rows = await adminStatsService.getHeatmapData();
  sendSuccess(res, { data: rows, message: 'Heatmap data retrieved' });
});

const overview = asyncHandler(async (req, res) => {
  const data = await adminStatsService.getOverview();
  sendSuccess(res, { data, message: 'Overview retrieved' });
});

module.exports = { topShows, monthlyGrowth, heatmap, overview };
