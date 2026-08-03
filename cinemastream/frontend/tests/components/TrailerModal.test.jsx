import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TrailerModal from '../../src/components/catalog/TrailerModal';

vi.mock('react-youtube', () => ({
  default: () => <div data-testid="youtube-player" />,
}));

vi.mock('../../src/api/tmdb', () => ({
  fetchMovieDetails: vi.fn(),
  fetchSeriesDetails: vi.fn(),
  fetchSimilarMovies: vi.fn().mockResolvedValue([]),
  fetchSimilarSeries: vi.fn().mockResolvedValue([]),
}));

vi.mock('../../src/api/youtube', () => ({
  fetchYoutubeTrailer: vi.fn(),
}));

vi.mock('../../src/api/watchApi', () => ({
  default: { recordWatch: vi.fn().mockResolvedValue({}) },
}));

const modalContent = {
  name: 'Test Movie',
  overview: 'A test overview.',
  genres: [{ id: 1, name: 'Action' }],
  actors: [{ id: 1, cast_id: 1, name: 'Actor One', character: 'Hero' }],
  rawItem: { id: 42, title: 'Test Movie', media_type: 'movie' },
};

describe('TrailerModal', () => {
  test('renders details and reveals the trailer player on play', async () => {
    render(
      <TrailerModal
        isOpen
        trailerUrl="https://www.youtube.com/embed/abc12345678"
        modalContent={modalContent}
        onClose={() => {}}
      />
    );

    expect(screen.getByRole('heading', { name: 'Test Movie' })).toBeInTheDocument();
    expect(screen.getByText('A test overview.')).toBeInTheDocument();
    expect(screen.getByText('Action')).toBeInTheDocument();
    expect(screen.getByText('Actor One')).toBeInTheDocument();

    expect(screen.queryByTestId('youtube-player')).not.toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Play Trailer/i }));

    expect(screen.getByTestId('youtube-player')).toBeInTheDocument();
  });

  test('renders nothing when closed and never opened', () => {
    const { container } = render(
      <TrailerModal isOpen={false} trailerUrl={null} modalContent={{}} onClose={() => {}} />
    );
    expect(container).toBeEmptyDOMElement();
  });
});
