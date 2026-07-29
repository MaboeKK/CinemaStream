import { useCallback, useState } from 'react';

const STORAGE_KEY = 'cinemastream:recentSearches';
const MAX_ENTRIES = 5;

const readRecent = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeRecent = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
};

export function useRecentSearches() {
  const [recent, setRecent] = useState(readRecent);

  const add = useCallback((term) => {
    const trimmed = term.trim();
    if (!trimmed) return;
    const next = [
      trimmed,
      ...readRecent().filter((existing) => existing.toLowerCase() !== trimmed.toLowerCase()),
    ].slice(0, MAX_ENTRIES);
    writeRecent(next);
    setRecent(next);
  }, []);

  const clear = useCallback(() => {
    writeRecent([]);
    setRecent([]);
  }, []);

  return { recent, add, clear };
}

export default useRecentSearches;
