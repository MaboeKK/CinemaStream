import { useCallback, useEffect, useState } from 'react';

const STORAGE_KEY = 'cinemastream:myList';

const readList = () => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
};

const writeList = (list) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event('mylist:change'));
};

export function useMyList() {
  const [list, setList] = useState(readList);

  useEffect(() => {
    const handleChange = () => setList(readList());
    window.addEventListener('mylist:change', handleChange);
    window.addEventListener('storage', handleChange);
    return () => {
      window.removeEventListener('mylist:change', handleChange);
      window.removeEventListener('storage', handleChange);
    };
  }, []);

  const isSaved = useCallback((id) => list.some((item) => item.id === id), [list]);

  const toggle = useCallback((item) => {
    const current = readList();
    const exists = current.some((entry) => entry.id === item.id);
    const next = exists
      ? current.filter((entry) => entry.id !== item.id)
      : [
          ...current,
          {
            id: item.id,
            media_type: item.media_type,
            title: item.title,
            name: item.name,
            poster_path: item.poster_path,
          },
        ];
    writeList(next);
  }, []);

  return { list, isSaved, toggle };
}

export default useMyList;
