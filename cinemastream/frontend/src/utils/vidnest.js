// Fallback embed provider for when vidking is unreachable or a specific
// title has no working source there. Unlike vidking, vidnest's embed
// doesn't document a color/autoplay query param, so these are left as
// plain URLs rather than guessing at unsupported params.
//
// Known limitation (as of 2026-09-14, kept as a fallback anyway per user
// decision): vidnest's own subtitle provider, sub.wyzie.io, currently
// rejects vidnest's embedded API key outright ({"code":403,"message":
// "Invalid API key"}) -- confirmed across multiple titles, not a
// per-title or environment issue. Captions simply don't load on vidnest
// right now regardless of the title. Entirely on vidnest's backend, not
// fixable from here; don't spend time debugging "broken captions" on this
// source without first re-checking whether that key issue is still live.
export function buildVidnestMovieUrl(tmdbId) {
  return `https://vidnest.fun/movie/${tmdbId}`;
}

export function buildVidnestTvUrl(tmdbId, season, episode) {
  return `https://vidnest.fun/tv/${tmdbId}/${season}/${episode}`;
}
