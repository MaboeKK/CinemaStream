import { describe, test, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WatchPage from '../../src/pages/catalog/WatchPage/WatchPage';

vi.mock('../../src/api/tmdb', () => ({
  fetchMovieDetails: vi.fn().mockResolvedValue({ name: 'The Godfather' }),
  fetchSeriesDetails: vi.fn().mockResolvedValue({ name: 'Test Series' }),
}));

vi.mock('../../src/api/watchApi', () => ({
  default: { recordWatch: vi.fn().mockResolvedValue({}) },
}));

import { fetchMovieDetails, fetchSeriesDetails } from '../../src/api/tmdb';
import watchApi from '../../src/api/watchApi';

describe('WatchPage', () => {
  test('renders the vidking embed for the routed movie id and records the watch', async () => {
    render(
      <MemoryRouter initialEntries={['/watch/movie/238']}>
        <Routes>
          <Route path="/watch/movie/:id" element={<WatchPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(screen.getByRole('button', { name: /back/i })).toBeInTheDocument();

    const iframe = document.querySelector('.watch-page-player');
    expect(iframe).toHaveAttribute('src', 'https://www.vidking.net/embed/movie/238?color=f453a6&autoPlay=true');

    await waitFor(() => expect(fetchMovieDetails).toHaveBeenCalledWith('238'));
    await waitFor(() =>
      expect(watchApi.recordWatch).toHaveBeenCalledWith({ movieId: 238, movieTitle: 'The Godfather' })
    );
  });

  test('renders the vidking TV embed for the routed series/season/episode and records the watch', async () => {
    render(
      <MemoryRouter initialEntries={['/watch/tv/99/2/5']}>
        <Routes>
          <Route path="/watch/tv/:id/:season/:episode" element={<WatchPage />} />
        </Routes>
      </MemoryRouter>
    );

    const iframe = document.querySelector('.watch-page-player');
    expect(iframe).toHaveAttribute(
      'src',
      'https://www.vidking.net/embed/tv/99/2/5?color=f453a6&nextEpisode=true&episodeSelector=true&autoPlay=true'
    );

    await waitFor(() => expect(fetchSeriesDetails).toHaveBeenCalledWith('99'));
    await waitFor(() =>
      expect(watchApi.recordWatch).toHaveBeenCalledWith({ seriesId: 99, seriesName: 'Test Series' })
    );
  });

  test('the source toggle button switches the iframe to vidnest and back', async () => {
    const user = userEvent.setup();
    render(
      <MemoryRouter initialEntries={['/watch/movie/238']}>
        <Routes>
          <Route path="/watch/movie/:id" element={<WatchPage />} />
        </Routes>
      </MemoryRouter>
    );

    expect(document.querySelector('.watch-page-player')).toHaveAttribute(
      'src',
      'https://www.vidking.net/embed/movie/238?color=f453a6&autoPlay=true'
    );

    await user.click(screen.getByRole('button', { name: /switch to player 2/i }));
    expect(document.querySelector('.watch-page-player')).toHaveAttribute(
      'src',
      'https://vidnest.fun/movie/238'
    );

    await user.click(screen.getByRole('button', { name: /switch to player 1/i }));
    expect(document.querySelector('.watch-page-player')).toHaveAttribute(
      'src',
      'https://www.vidking.net/embed/movie/238?color=f453a6&autoPlay=true'
    );
  });

  describe('auto-fallback on load timeout', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    test('falls back to vidnest if vidking never fires onLoad', async () => {
      render(
        <MemoryRouter initialEntries={['/watch/movie/238']}>
          <Routes>
            <Route path="/watch/movie/:id" element={<WatchPage />} />
          </Routes>
        </MemoryRouter>
      );

      expect(document.querySelector('.watch-page-player')).toHaveAttribute(
        'src',
        'https://www.vidking.net/embed/movie/238?color=f453a6&autoPlay=true'
      );

      // Deliberately never fire the iframe's onLoad -- simulates vidking
      // being unreachable rather than just slow.
      await act(async () => {
        vi.advanceTimersByTime(8000);
      });

      expect(document.querySelector('.watch-page-player')).toHaveAttribute(
        'src',
        'https://vidnest.fun/movie/238'
      );
    });

    test('does not auto-fallback once vidking has already loaded', async () => {
      render(
        <MemoryRouter initialEntries={['/watch/movie/238']}>
          <Routes>
            <Route path="/watch/movie/:id" element={<WatchPage />} />
          </Routes>
        </MemoryRouter>
      );

      const iframe = document.querySelector('.watch-page-player');
      await act(async () => {
        iframe.dispatchEvent(new Event('load'));
      });

      await act(async () => {
        vi.advanceTimersByTime(8000);
      });

      expect(document.querySelector('.watch-page-player')).toHaveAttribute(
        'src',
        'https://www.vidking.net/embed/movie/238?color=f453a6&autoPlay=true'
      );
    });
  });
});
