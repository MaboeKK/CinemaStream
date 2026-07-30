import { useEffect, useRef, useState } from 'react';

// Watches a sentinel element and calls onLoadMore whenever it scrolls into
// view. onLoadMore is read from a ref (not a hook dependency) so callers
// don't need to memoize it. The sentinel node itself is tracked in state
// (not a plain ref) and included as an effect dependency -- callers only
// render the sentinel <div> once data has loaded (it doesn't exist during
// the initial empty/skeleton state), so a plain ref's `.current` would
// still be null the one time this effect ran, with nothing left to ever
// re-trigger it. Using a state-backed callback ref means the effect reruns
// as soon as the node actually mounts, not just when `hasMore` changes.
export function useInfiniteScroll({ onLoadMore, hasMore }) {
  const [node, setNode] = useState(null);
  const onLoadMoreRef = useRef(onLoadMore);
  onLoadMoreRef.current = onLoadMore;

  useEffect(() => {
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
  }, [node, hasMore]);

  return setNode;
}

export default useInfiniteScroll;
