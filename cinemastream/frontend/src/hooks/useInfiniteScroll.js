import { useEffect, useRef } from 'react';

// Watches a sentinel element and calls onLoadMore whenever it scrolls into
// view. onLoadMore is read from a ref (not a hook dependency) so callers
// don't need to memoize it -- the observer itself only needs to be
// recreated when `hasMore` flips (permanently stops observing once false,
// satisfying "stop attempting to fetch once all pages are loaded"). Callers
// are still expected to guard their own onLoadMore against re-entrant calls
// while a fetch is already in flight.
export function useInfiniteScroll({ onLoadMore, hasMore }) {
  const sentinelRef = useRef(null);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
    const node = sentinelRef.current;
    if (!node || !hasMore) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          onLoadMoreRef.current();
        }
      },
      { rootMargin: '400px' }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [hasMore]);

  return sentinelRef;
}

export default useInfiniteScroll;
