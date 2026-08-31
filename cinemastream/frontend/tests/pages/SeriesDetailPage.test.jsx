import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import SeriesDetailPage from '../../src/pages/catalog/SeriesDetailPage/SeriesDetailPage';

vi.mock('react-youtube', () => ({
  default: () => <div data-testid="youtube-player" />,
}));

const mockNavigate = vi.fn();
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return { ...actual, useNavigate: () => mockNavigate };
});

const series = {
  id: 99,
  name: 'Test Series',
  overview: 'A show about testing.',
  genres: [{ id: 1, name: 'Drama' }],
  actors: [{ id: 1, cast_id: 1, name: 'Actor One', character: 'Lead', profile_path: null }],
  poster_path: null,
  backdrop_path: '/backdrop.jpg',
  vote_average: 7.5,
  release_date: '2020-01-01',
  seasons: [
    { season_number: 1, name: 'Season 1' },
    { season_number: 2, name: 'Season 2' },
  ],
};

const season1Episodes = [
  { id: 1, episode_number: 1, name: 'Pilot', overview: 'It begins.', runtime: 42, still_path: null },
  { id: 2, episode_number: 2, name: 'Second', overview: 'It continues.', runtime: 40, still_path: null },
];
const season2Episodes = [
  { id: 3, episode_number: 1, name: 'S2 Opener', overview: 'New season.', runtime: 45, still_path: null },
];

vi.mock('../../src/api/tmdb', () => ({
  fetchSeriesDetails: vi.fn(),
  fetchSeasonEpisodes: vi.fn(),
  fetchSimilarSeries: vi.fn(),
}));

vi.mock('../../src/api/youtube', () => ({
  fetchYoutubeTrailer: vi.fn(),
}));

import { fetchSeriesDetails, fetchSeasonEpisodes, fetchSimilarSeries } from '../../src/api/tmdb';
import { fetchYoutubeTrailer } from '../../src/api/youtube';

function renderPage(id = '99') {
  return render(
    <MemoryRouter initialEntries={[`/watch/tv/${id}`]}>
      <Routes>
        <Route path="/watch/tv/:id" element={<SeriesDetailPage />} />
      </Routes>
    </MemoryRouter>
  );
}

describe('SeriesDetailPage', () => {
  test('loads series details and the first season episodes by default', async () => {
    fetchSeriesDetails.mockResolvedValue(series);
    fetchSeasonEpisodes.mockResolvedValue(season1Episodes);

    renderPage();

    expect(await screen.findByRole('heading', { name: 'Test Series' })).toBeInTheDocument();
    expect(screen.getByText('2 Seasons')).toBeInTheDocument();
    expect(screen.getByText('Drama')).toBeInTheDocument();

    await waitFor(() => expect(fetchSeasonEpisodes).toHaveBeenCalledWith('99', 1));
    expect(await screen.findByText('Pilot')).toBeInTheDocument();
    expect(screen.getByText('Second')).toBeInTheDocument();
  });

  test('switching season fetches and displays that season\'s episodes', async () => {
    fetchSeriesDetails.mockResolvedValue(series);
    fetchSeasonEpisodes.mockImplementation((id, season) =>
      Promise.resolve(season === 2 ? season2Episodes : season1Episodes)
    );

    renderPage();
    await screen.findByText('Pilot');

    await userEvent.click(screen.getByRole('button', { name: /Season 1/i }));
    await userEvent.click(screen.getByText('Season 2'));

    await waitFor(() => expect(fetchSeasonEpisodes).toHaveBeenCalledWith('99', 2));
    expect(await screen.findByText('S2 Opener')).toBeInTheDocument();
    expect(screen.queryByText('Pilot')).not.toBeInTheDocument();
  });

  test('Play navigates to the selected season\'s first episode', async () => {
    fetchSeriesDetails.mockResolvedValue(series);
    fetchSeasonEpisodes.mockResolvedValue(season1Episodes);

    renderPage();
    await screen.findByText('Pilot');

    await userEvent.click(screen.getByRole('button', { name: /^Play$/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/watch/tv/99/1/1');
  });

  test('clicking an episode navigates to that specific episode', async () => {
    fetchSeriesDetails.mockResolvedValue(series);
    fetchSeasonEpisodes.mockResolvedValue(season1Episodes);

    renderPage();
    await screen.findByText('Second');

    await userEvent.click(screen.getByRole('button', { name: /Play Second/i }));

    expect(mockNavigate).toHaveBeenCalledWith('/watch/tv/99/1/2');
  });

  test('Trailers tab lazy-loads the trailer only once, on first visit', async () => {
    fetchSeriesDetails.mockResolvedValue(series);
    fetchSeasonEpisodes.mockResolvedValue(season1Episodes);
    fetchYoutubeTrailer.mockResolvedValue('https://www.youtube.com/embed/abc12345678');

    renderPage();
    await screen.findByText('Pilot');
    expect(fetchYoutubeTrailer).not.toHaveBeenCalled();

    const tabs = within(document.querySelector('.series-detail-tabs'));
    await userEvent.click(screen.getByRole('button', { name: /Trailers & More/i }));
    await waitFor(() => expect(fetchYoutubeTrailer).toHaveBeenCalledWith('Test Series'));

    await userEvent.click(tabs.getByRole('button', { name: /^Episodes$/i }));
    await userEvent.click(screen.getByRole('button', { name: /Trailers & More/i }));

    expect(fetchYoutubeTrailer).toHaveBeenCalledTimes(1);
  });

  test('Similar tab loads and links to each item\'s own picker page', async () => {
    fetchSeriesDetails.mockResolvedValue(series);
    fetchSeasonEpisodes.mockResolvedValue(season1Episodes);
    fetchSimilarSeries.mockResolvedValue([{ id: 200, name: 'Other Show', poster_path: null }]);

    renderPage();
    await screen.findByText('Pilot');

    await userEvent.click(screen.getByRole('button', { name: /Similar/i }));
    const item = await screen.findByText('Other Show');

    await userEvent.click(item.closest('button'));

    expect(mockNavigate).toHaveBeenCalledWith('/watch/tv/200');
  });
});
