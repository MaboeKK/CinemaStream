const watchedHistoryRepository = require('../repositories/watchedHistory.repository');

const getTopShows = () => watchedHistoryRepository.getTopShows();
const getMonthlyUserGrowth = () => watchedHistoryRepository.getMonthlyUserGrowth();
const getHeatmapData = () => watchedHistoryRepository.getHeatmapData();

module.exports = { getTopShows, getMonthlyUserGrowth, getHeatmapData };
