import { useCallback, useSyncExternalStore } from 'react';
import { createListStore } from './createListStore';

const store = createListStore('cinemastream:myList', 'mylist:change');

export function useMyList() {
  const { list, idSet } = useSyncExternalStore(store.subscribe, store.getSnapshot);

  const isSaved = useCallback((id) => idSet.has(id), [idSet]);
  const toggle = useCallback((item) => store.toggle(item), []);

  return { list, isSaved, toggle };
}

export default useMyList;
