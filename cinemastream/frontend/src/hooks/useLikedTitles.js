import { useCallback, useSyncExternalStore } from 'react';
import { createListStore } from './createListStore';

const store = createListStore('cinemastream:likedTitles', 'liked:change');

export function useLikedTitles() {
  const { list, idSet } = useSyncExternalStore(store.subscribe, store.getSnapshot);

  const isLiked = useCallback((id) => idSet.has(id), [idSet]);
  const toggle = useCallback((item) => store.toggle(item), []);

  return { list, isLiked, toggle };
}

export default useLikedTitles;
