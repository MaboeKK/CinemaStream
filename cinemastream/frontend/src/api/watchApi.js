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

const getHistory = () => httpClient.get('/watch/history').then((r) => r.data);

const watchApi = { recordWatch, getHistory };

export default watchApi;
