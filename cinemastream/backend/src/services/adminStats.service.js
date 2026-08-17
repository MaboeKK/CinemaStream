const watchedHistoryRepository = require('../repositories/watchedHistory.repository');
const loginHistoryRepository = require('../repositories/loginHistory.repository');
const userRepository = require('../repositories/user.repository');

const getTopShows = () => watchedHistoryRepository.getTopShows();
const getMonthlyUserGrowth = () => watchedHistoryRepository.getMonthlyUserGrowth();
const getHeatmapData = () => watchedHistoryRepository.getHeatmapData();
const getSignupFunnel = () => userRepository.getSignupFunnel();
const getRetentionCohorts = () => userRepository.getRetentionCohorts();
const getSessionLength = () => loginHistoryRepository.getAvgSessionLengthByDay();

const getOverview = async () => {
  const [{ totalWatched, rewatches }, activeUsers, totalUsers] = await Promise.all([
    watchedHistoryRepository.getPlatformOverview(),
    loginHistoryRepository.getActiveUserCount(),
    userRepository.countAll(),
  ]);
  return { totalWatched, rewatches, activeUsers, totalUsers };
};

module.exports = {
  getTopShows,
  getMonthlyUserGrowth,
  getHeatmapData,
  getOverview,
  getSignupFunnel,
  getRetentionCohorts,
  getSessionLength,
};
