const asyncHandler = require('../utils/asyncHandler');
const watchService = require('../services/watch.service');

const recordWatch = asyncHandler(async (req, res) => {
  const { movie_id, series_id, movie_title, series_name } = req.body;

  await watchService.recordWatch({
    userId: req.user.id,
    movieId: movie_id,
    seriesId: series_id,
    movieTitle: movie_title,
    seriesName: series_name,
  });

  res.status(201).json({ status: 'SUCCESS', message: 'Watch event saved' });
});

const getHistory = asyncHandler(async (req, res) => {
  const history = await watchService.getRecentByUser(req.user.id);
  res.json(history);
});

module.exports = { recordWatch, getHistory };
