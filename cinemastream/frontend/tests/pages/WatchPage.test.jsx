import { describe, test, expect, vi } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';
import WatchPage from '../../src/pages/catalog/WatchPage/WatchPage';

vi.mock('../../src/api/tmdb', () => ({
  fetchMovieDetails: vi.fn().mockResolvedValue({ name: 'The Godfather' }),
}));

vi.mock('../../src/api/watchApi', () => ({
  default: { recordWatch: vi.fn().mockResolvedValue({}) },
}));

import { fetchMovieDetails } from '../../src/api/tmdb';
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
});
