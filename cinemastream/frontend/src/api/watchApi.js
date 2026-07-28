import httpClient from './httpClient';

const recordWatch = ({ movieId, seriesId, movieTitle, seriesName }) =>
  httpClient
    .post('/watch', {
      movie_id: movieId || undefined,
      series_id: seriesId || undefined,
      movie_title: movieTitle || undefined,
      series_name: seriesName || undefined,
    })
    .then((r) => r.data);

const watchApi = { recordWatch };

export default watchApi;
