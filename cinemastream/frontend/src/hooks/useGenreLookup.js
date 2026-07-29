import { useEffect, useState } from 'react';
import { fetchGenres, fetchSeriesGenres } from '../api/tmdb';

let cachedPromise = null;

function getGenreMaps() {
  if (!cachedPromise) {
    cachedPromise = Promise.all([fetchGenres(), fetchSeriesGenres()]).then(([movies, tv]) => ({
      movie: Object.fromEntries(movies.map((g) => [g.id, g.name])),
      tv: Object.fromEntries(tv.map((g) => [g.id, g.name])),
    }));
  }
  return cachedPromise;
}

export function useGenreLookup() {
  const [maps, setMaps] = useState(null);

  useEffect(() => {
    let cancelled = false;
    getGenreMaps().then((resolved) => {
      if (!cancelled) setMaps(resolved);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  return maps;
}

export default useGenreLookup;
