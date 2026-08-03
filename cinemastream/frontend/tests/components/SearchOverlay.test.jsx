import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import SearchOverlay from '../../src/components/catalog/SearchOverlay';

vi.mock('../../src/api/tmdb', () => ({
  fetchGenres: vi.fn().mockResolvedValue([{ id: 28, name: 'Action' }]),
  fetchTrending: vi.fn().mockResolvedValue([
    { id: 1, media_type: 'movie', title: 'Trend One', poster_path: '/t1.jpg' },
  ]),
  // Term-aware so the "no matches" test can exercise the actual empty branch
  // instead of always getting a hit regardless of what was searched.
  searchMovies: vi.fn().mockImplementation((term) =>
    Promise.resolve(term === 'searched' ? [{ id: 2, title: 'Searched Movie', poster_path: '/s1.jpg' }] : [])
  ),
  searchSeries: vi.fn().mockResolvedValue([]),
}));

describe('SearchOverlay', () => {
  test('shows trending results when there is no query yet', async () => {
    render(
      <MemoryRouter>
        <SearchOverlay term="" onSelect={() => {}} onClear={() => {}} />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Trend One')).toBeInTheDocument());
    expect(screen.getByText('Trending Now')).toBeInTheDocument();
  });

  test('shows matching movies for a query', async () => {
    render(
      <MemoryRouter>
        <SearchOverlay term="searched" onSelect={() => {}} onClear={() => {}} />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText('Searched Movie')).toBeInTheDocument());
  });

  test('shows an empty state when a query matches nothing', async () => {
    render(
      <MemoryRouter>
        <SearchOverlay term="zzzznomatch" onSelect={() => {}} onClear={() => {}} />
      </MemoryRouter>
    );

    await waitFor(() => expect(screen.getByText(/No results for/)).toBeInTheDocument());
  });
});
