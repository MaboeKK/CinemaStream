// Youtube API TO FETCH TRAILER
const API_KEY = 'AIzaSyBhLzkAIg0s5oyRFDQZIM48e9PCXGbjAGE';

export const fetchYoutubeTrailer = async (movieTitle) => {
  const searchQuery = `${movieTitle} official trailer`;
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(searchQuery)}&key=${API_KEY}&maxResults=1&type=video`
  );
  const data = await response.json();
  if (data.items.length > 0) {
    return `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
  }
  return null;
};
