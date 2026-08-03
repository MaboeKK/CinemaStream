const asyncHandler = require('../utils/asyncHandler');
const adminStatsService = require('../services/adminStats.service');

const topShows = asyncHandler(async (req, res) => {
  const rows = await adminStatsService.getTopShows();
  res.json(rows);
});

const monthlyGrowth = asyncHandler(async (req, res) => {
  const rows = await adminStatsService.getMonthlyUserGrowth();
  res.json(rows);
});

const heatmap = asyncHandler(async (req, res) => {
  const rows = await adminStatsService.getHeatmapData();
  res.json(rows);
});

const overview = asyncHandler(async (req, res) => {
  const data = await adminStatsService.getOverview();
  res.json(data);
});

module.exports = { topShows, monthlyGrowth, heatmap, overview };
