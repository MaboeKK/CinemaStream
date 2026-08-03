import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { FaFilm } from 'react-icons/fa';
import { AuthProvider } from '../../src/context/AuthContext';
import CatalogListPage from '../../src/components/catalog/CatalogListPage';

vi.mock('../../src/api/authApi', () => ({
  default: { checkAuth: vi.fn().mockRejectedValue(new Error('not logged in')) },
}));

vi.mock('../../src/api/youtube', () => ({
  fetchYoutubeTrailer: vi.fn(),
}));

// MovieCard resolves genre pill names via useGenreLookup, which hits the
// real TMDB module directly -- stub it so cards render without a live call.
vi.mock('../../src/api/tmdb', () => ({
  fetchGenres: vi.fn().mockResolvedValue([]),
  fetchSeriesGenres: vi.fn().mockResolvedValue([]),
}));

const movies = [
  { id: 1, title: 'Movie One', poster_path: '/a.jpg', vote_average: 7.2, release_date: '2020-01-01' },
  { id: 2, title: 'Movie Two', poster_path: '/b.jpg', vote_average: 8.1, release_date: '2021-01-01' },
];

const renderPage = (props, entries = ['/movies']) =>
  render(
    <MemoryRouter initialEntries={entries}>
      <AuthProvider>
        <CatalogListPage
          mediaType="movie"
          title="Movies"
          searchPlaceholder="Search movies by name..."
          emptyIcon={<FaFilm />}
          emptyTitle="No movies found"
          genreSelectId="movie-genre-select"
          fetchGenres={vi.fn().mockResolvedValue([])}
          searchFn={vi.fn().mockResolvedValue([])}
          discoverFn={vi.fn().mockResolvedValue([])}
          fetchDetails={vi.fn()}
          {...props}
        />
      </AuthProvider>
    </MemoryRouter>
  );

describe('CatalogListPage', () => {
  test('renders the discovered list from discoverFn', async () => {
    const discoverFn = vi.fn().mockResolvedValue(movies);

    renderPage({ discoverFn });

    expect(screen.getByRole('heading', { name: 'Movies' })).toBeInTheDocument();
    await waitFor(() => expect(screen.getByText('Movie One')).toBeInTheDocument());
    expect(screen.getByText('Movie Two')).toBeInTheDocument();
    expect(discoverFn).toHaveBeenCalledWith('', 1);
  });

  test('shows the empty state with a clear-filters action when nothing matches a search', async () => {
    renderPage({}, ['/movies?q=zzzznomatch']);

    await waitFor(() => expect(screen.getByText('No movies found')).toBeInTheDocument());
    expect(screen.getByRole('button', { name: 'Clear filters' })).toBeInTheDocument();
  });
});
