// Youtube API TO FETCH TRAILER
const API_KEY = 'AIzaSyCuY3avJ50MIWrH5X8rBmdBUALWYWASb1o';



export const fetchYoutubeTrailer = async (movieTitle) => {
  const response = await fetch(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(movieTitle)}&key=${API_KEY}&maxResults=1&type=video`
  );

  if (!response.ok) {
    console.error('YouTube API error:', response.status, response.statusText);
    return null;
  }

  const data = await response.json();
  console.log('YouTube search data:', data);  // For debugging

  if (data.items && data.items.length > 0) {
    return `https://www.youtube.com/embed/${data.items[0].id.videoId}`;
  }
  return null;
};
