// Matches --color-accent in index.css -- vidking's embed only exposes a
// single flat "color" param (no gradient support), so this is the closest
// on-brand match to the site's sunset gradient.
export const VIDKING_ACCENT_COLOR = 'f453a6';

// Movies only -- there's no season/episode picker in this app yet for a
// TV content embed (vidking's TV route needs /embed/tv/{id}/{season}/{episode}).
export function buildVidkingMovieUrl(tmdbId, { autoPlay = true } = {}) {
  const params = new URLSearchParams({ color: VIDKING_ACCENT_COLOR });
  if (autoPlay) params.set('autoPlay', 'true');
  return `https://www.vidking.net/embed/movie/${tmdbId}?${params.toString()}`;
}
