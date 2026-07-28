const watchedHistoryRepository = require('../repositories/watchedHistory.repository');

const recordWatch = async ({ userId, movieId, seriesId, movieTitle, seriesName }) => {
  await watchedHistoryRepository.recordWatch({ userId, movieId, seriesId, movieTitle, seriesName });
};

const getRecentByUser = (userId) => watchedHistoryRepository.getRecentByUser(userId);

module.exports = { recordWatch, getRecentByUser };
