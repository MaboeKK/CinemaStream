// Matches --color-accent in index.css -- vidking's embed only exposes a
// single flat "color" param (no gradient support), so this is the closest
// on-brand match to the site's sunset gradient.
export const VIDKING_ACCENT_COLOR = 'f453a6';

export function buildVidkingMovieUrl(tmdbId, { autoPlay = true } = {}) {
  const params = new URLSearchParams({ color: VIDKING_ACCENT_COLOR });
  if (autoPlay) params.set('autoPlay', 'true');
  return `https://www.vidking.net/embed/movie/${tmdbId}?${params.toString()}`;
}

// This app has no season/episode browsing UI of its own, so a TV watch
// always starts at season 1 episode 1 -- nextEpisode/episodeSelector are
// on so vidking's own in-player controls (visible in their Settings-style
// panel) let the viewer pick a different season/episode or advance from
// there, the same way we lean on their native UI for quality/subtitles.
export function buildVidkingTvUrl(tmdbId, season, episode, { autoPlay = true } = {}) {
  const params = new URLSearchParams({
    color: VIDKING_ACCENT_COLOR,
    nextEpisode: 'true',
    episodeSelector: 'true',
  });
  if (autoPlay) params.set('autoPlay', 'true');
  return `https://www.vidking.net/embed/tv/${tmdbId}/${season}/${episode}?${params.toString()}`;
}
