import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

// TMDB list endpoints return 20 results per page and simply give fewer on
// the last page -- no reliable total-pages field is plumbed through
// api/tmdb.js today, so "fewer than a full page" is the signal used here
// to stop infinite-scrolling instead.
const TMDB_PAGE_SIZE = 20;

// Shared paging/search/genre-filter state machine behind MoviesPage and
// SeriesPage -- the two were near-identical, differing only in which TMDB
// functions they called.
export function useCatalogList({ fetchGenres, searchFn, discoverFn }) {
  const [searchParams] = useSearchParams();
  const [list, setList] = useState([]);
  const [genres, setGenres] = useState([]);
  const [selectedGenre, setSelectedGenre] = useState(searchParams.get('genre') || '');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');
  const loadingRef = useRef(false);

  useEffect(() => {
    fetchGenres().then(setGenres);
  }, [fetchGenres]);

  const load = async (targetPage, reset = false) => {
    loadingRef.current = true;
    setLoading(true);
    try {
      const results = searchTerm.trim()
        ? await searchFn(searchTerm, targetPage)
        : await discoverFn(selectedGenre, targetPage);
      setList((prev) => (reset ? results : [...prev, ...results]));
      setHasMore(results.length >= TMDB_PAGE_SIZE);
    } catch (err) {
      console.error('Failed to load catalog list', err);
      setHasMore(false);
    }
    loadingRef.current = false;
    setLoading(false);
  };

  useEffect(() => {
    setList([]);
    setPage(1);
    setHasMore(true);
    load(1, true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedGenre, searchTerm]);

  const loadMore = () => {
    if (loadingRef.current || !hasMore) return;
    const nextPage = page + 1;
    setPage(nextPage);
    load(nextPage);
  };

  return {
    list,
    genres,
    selectedGenre,
    setSelectedGenre,
    searchTerm,
    setSearchTerm,
    loading,
    hasMore,
    loadMore,
  };
}

export default useCatalogList;
