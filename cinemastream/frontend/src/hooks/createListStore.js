// Shared implementation behind useMyList/useLikedTitles: both are a
// localStorage-backed list of { id, media_type, title, name, poster_path }
// entries, toggled on/off by id, and mirrored across tabs. Built as a
// module-level singleton store (subscribe/getSnapshot, for React's
// useSyncExternalStore) rather than per-hook-instance state so that:
//   - localStorage is parsed once per change, not once per mounted
//     MovieCard (a grid can mount dozens of cards, each previously ran its
//     own read + JSON.parse + event listener for the same underlying list).
//   - membership checks (isSaved/isLiked) are an id Set lookup -- O(1) --
//     instead of each card doing its own Array.some() scan over the list.
export function createListStore(storageKey, eventName) {
  const readList = () => {
    try {
      const raw = localStorage.getItem(storageKey);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  };

  const buildSnapshot = (list) => ({ list, idSet: new Set(list.map((item) => item.id)) });

  // Snapshot is a single stable reference, only replaced on refresh() --
  // useSyncExternalStore requires getSnapshot() to return the same
  // reference across calls until something actually changed.
  let snapshot = buildSnapshot(readList());
  const listeners = new Set();

  const refresh = () => {
    snapshot = buildSnapshot(readList());
    listeners.forEach((listener) => listener());
  };

  if (typeof window !== 'undefined') {
    window.addEventListener(eventName, refresh);
    window.addEventListener('storage', (e) => {
      if (!e.key || e.key === storageKey) refresh();
    });
  }

  const subscribe = (listener) => {
    listeners.add(listener);
    return () => listeners.delete(listener);
  };

  const getSnapshot = () => snapshot;

  const toggle = (item) => {
    const exists = snapshot.idSet.has(item.id);
    const next = exists
      ? snapshot.list.filter((entry) => entry.id !== item.id)
      : [
          ...snapshot.list,
          {
            id: item.id,
            media_type: item.media_type,
            title: item.title,
            name: item.name,
            poster_path: item.poster_path,
          },
        ];
    localStorage.setItem(storageKey, JSON.stringify(next));
    window.dispatchEvent(new Event(eventName));
  };

  return { subscribe, getSnapshot, toggle };
}

export default createListStore;
