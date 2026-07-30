import { describe, test, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import LandingPage from '../../src/pages/marketing/LandingPage/LandingPage';

vi.mock('../../src/api/tmdb', () => ({
  fetchPopularMovies: vi.fn().mockResolvedValue([]),
  fetchPopularSeries: vi.fn().mockResolvedValue([]),
}));

describe('LandingPage', () => {
  test('renders the hero content and nav links', () => {
    render(
      <MemoryRouter>
        <LandingPage />
      </MemoryRouter>
    );

    expect(screen.getByText('Get access to the best movies and TV shows')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Sign In' })).toHaveAttribute('href', '/login');
    expect(screen.getByRole('link', { name: 'Register' })).toHaveAttribute('href', '/register');
    expect(screen.getByText('Popular Movies')).toBeInTheDocument();
    expect(screen.getByText('Popular Series')).toBeInTheDocument();
  });
});
