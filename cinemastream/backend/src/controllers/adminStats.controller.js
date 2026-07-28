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

module.exports = { topShows, monthlyGrowth, heatmap };
