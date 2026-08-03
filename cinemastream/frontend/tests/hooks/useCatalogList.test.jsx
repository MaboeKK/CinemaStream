import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import { useCatalogList } from '../../src/hooks/useCatalogList';

const makeItems = (page, count) => Array.from({ length: count }, (_, i) => ({ id: page * 100 + i }));

function Harness({ fetchGenres, searchFn, discoverFn }) {
  const { list, selectedGenre, setSearchTerm, hasMore, loadMore } = useCatalogList({
    fetchGenres,
    searchFn,
    discoverFn,
  });

  return (
    <div>
      <span data-testid="ids">{list.map((i) => i.id).join(',')}</span>
      <span data-testid="genre">{selectedGenre}</span>
      <span data-testid="hasMore">{String(hasMore)}</span>
      <button onClick={() => setSearchTerm('batman')}>search</button>
      <button onClick={loadMore}>more</button>
    </div>
  );
}

describe('useCatalogList', () => {
  test('reads the initial genre from the URL and loads the first page via discoverFn', async () => {
    const fetchGenres = vi.fn().mockResolvedValue([]);
    const discoverFn = vi.fn().mockImplementation((genre, page = 1) => Promise.resolve(makeItems(page, 20)));
    const searchFn = vi.fn();

    render(
      <MemoryRouter initialEntries={['/movies?genre=28']}>
        <Harness fetchGenres={fetchGenres} searchFn={searchFn} discoverFn={discoverFn} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('genre').textContent).toBe('28');
    await waitFor(() => expect(discoverFn).toHaveBeenCalledWith('28', 1));
    await waitFor(() =>
      expect(screen.getByTestId('ids').textContent.split(',').filter(Boolean)).toHaveLength(20)
    );
  });

  test('loadMore appends the next page and hasMore turns false once a short page comes back', async () => {
    const fetchGenres = vi.fn().mockResolvedValue([]);
    const discoverFn = vi
      .fn()
      .mockResolvedValueOnce(makeItems(1, 20))
      .mockResolvedValueOnce(makeItems(2, 5));
    const searchFn = vi.fn();

    render(
      <MemoryRouter>
        <Harness fetchGenres={fetchGenres} searchFn={searchFn} discoverFn={discoverFn} />
      </MemoryRouter>
    );

    await waitFor(() =>
      expect(screen.getByTestId('ids').textContent.split(',').filter(Boolean)).toHaveLength(20)
    );
    expect(screen.getByTestId('hasMore').textContent).toBe('true');

    await userEvent.click(screen.getByText('more'));

    await waitFor(() =>
      expect(screen.getByTestId('ids').textContent.split(',').filter(Boolean)).toHaveLength(25)
    );
    expect(screen.getByTestId('hasMore').textContent).toBe('false');
  });

  test('setting a search term calls searchFn instead of discoverFn and resets the list', async () => {
    const fetchGenres = vi.fn().mockResolvedValue([]);
    const discoverFn = vi.fn().mockResolvedValue(makeItems(1, 20));
    const searchFn = vi.fn().mockResolvedValue(makeItems(9, 2));

    render(
      <MemoryRouter>
        <Harness fetchGenres={fetchGenres} searchFn={searchFn} discoverFn={discoverFn} />
      </MemoryRouter>
    );

    await waitFor(() => expect(discoverFn).toHaveBeenCalled());

    await userEvent.click(screen.getByText('search'));

    await waitFor(() => expect(searchFn).toHaveBeenCalledWith('batman', 1));
    await waitFor(() =>
      expect(screen.getByTestId('ids').textContent.split(',').filter(Boolean)).toHaveLength(2)
    );
  });
});
