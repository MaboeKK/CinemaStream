const asyncHandler = require('../utils/asyncHandler');
const watchService = require('../services/watch.service');
const { sendSuccess } = require('../utils/response');

const recordWatch = asyncHandler(async (req, res) => {
  const { movie_id, series_id, movie_title, series_name } = req.body;

  await watchService.recordWatch({
    userId: req.user.id,
    movieId: movie_id,
    seriesId: series_id,
    movieTitle: movie_title,
    seriesName: series_name,
  });

  sendSuccess(res, { status: 201, message: 'Watch event saved' });
});

const getHistory = asyncHandler(async (req, res) => {
  const history = await watchService.getRecentByUser(req.user.id);
  sendSuccess(res, { data: history, message: 'Watch history retrieved' });
});

module.exports = { recordWatch, getHistory };
