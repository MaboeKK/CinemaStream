import { buildVidkingMovieUrl, buildVidkingTvUrl } from './vidking';
import { buildVidnestMovieUrl, buildVidnestTvUrl } from './vidnest';

// Single source of truth for every /watch/* playback provider, tried in
// order. WatchPage.jsx cycles through this list by index rather than
// hardcoding provider names in comparisons -- adding, removing, or
// reordering a provider is a change to this array alone.
//
// Labels are deliberately generic ("Player N"), not the vendor name: these
// are third-party embeds that can go down or get swapped out, and a
// neutral label means that's a one-line change to buildUrl here, not a
// rename that has to be chased through UI copy, aria-labels, and tests.
export const WATCH_SOURCES = [
  {
    label: 'Player 1',
    buildUrl: (isTv, tmdbId, season, episode) =>
      isTv ? buildVidkingTvUrl(tmdbId, season, episode) : buildVidkingMovieUrl(tmdbId),
  },
  {
    label: 'Player 2',
    // Known limitation (2026-09-14, kept as a fallback anyway): this
    // source's own subtitle provider currently rejects its embedded API
    // key outright, so captions don't load here regardless of title. Not
    // fixable from our side -- see utils/vidnest.js for the full note
    // before assuming this is a bug worth chasing.
    buildUrl: (isTv, tmdbId, season, episode) =>
      isTv ? buildVidnestTvUrl(tmdbId, season, episode) : buildVidnestMovieUrl(tmdbId),
  },
];
