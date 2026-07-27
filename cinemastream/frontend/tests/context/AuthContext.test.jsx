import { describe, test, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AuthProvider, useAuth } from '../../src/context/AuthContext';
import authApi from '../../src/api/authApi';

vi.mock('../../src/api/authApi', () => ({
  default: {
    checkAuth: vi.fn(),
    login: vi.fn(),
    logout: vi.fn(),
  },
}));

// Renders the raw context state so tests can assert on it and trigger
// login/logout through plain buttons instead of reaching into internals.
function AuthConsumer() {
  const { user, isAuthenticated, loading, login, logout } = useAuth();
  return (
    <div>
      <span data-testid="loading">{String(loading)}</span>
      <span data-testid="authenticated">{String(isAuthenticated)}</span>
      <span data-testid="user-email">{user?.email ?? ''}</span>
      <button onClick={() => login('test@example.com', 'password123', false)}>Login</button>
      {/* logout() rejects when the request fails but still clears local state (see AuthContext) -- swallow here like a real caller would after showing its own error toast */}
      <button onClick={() => logout().catch(() => {})}>Logout</button>
    </div>
  );
}

const renderWithProvider = () =>
  render(
    <AuthProvider>
      <AuthConsumer />
    </AuthProvider>
  );

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  test('checks the session on mount and exposes the authenticated user', async () => {
    authApi.checkAuth.mockResolvedValue({ user: { email: 'test@example.com' } });

    renderWithProvider();

    expect(screen.getByTestId('loading').textContent).toBe('true');

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    expect(screen.getByTestId('authenticated').textContent).toBe('true');
    expect(screen.getByTestId('user-email').textContent).toBe('test@example.com');
  });

  test('treats a failed session check as logged out', async () => {
    authApi.checkAuth.mockRejectedValue(new Error('not logged in'));

    renderWithProvider();

    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
    expect(screen.getByTestId('user-email').textContent).toBe('');
  });

  test('login stores the returned user on success', async () => {
    authApi.checkAuth.mockRejectedValue(new Error('not logged in'));
    authApi.login.mockResolvedValue({
      status: 'SUCCESS',
      data: { email: 'test@example.com', role: 'guest' },
    });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('loading').textContent).toBe('false'));

    await userEvent.click(screen.getByText('Login'));

    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('true'));
    expect(screen.getByTestId('user-email').textContent).toBe('test@example.com');
  });

  test('logout clears the user even if the request fails', async () => {
    authApi.checkAuth.mockResolvedValue({ user: { email: 'test@example.com' } });
    authApi.logout.mockRejectedValue(new Error('network error'));

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('true'));

    await userEvent.click(screen.getByText('Logout'));

    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('false'));
    expect(screen.getByTestId('user-email').textContent).toBe('');
  });

  test('clears the user when a session-expired event is dispatched', async () => {
    authApi.checkAuth.mockResolvedValue({ user: { email: 'test@example.com' } });

    renderWithProvider();
    await waitFor(() => expect(screen.getByTestId('authenticated').textContent).toBe('true'));

    act(() => {
      window.dispatchEvent(new Event('auth:session-expired'));
    });

    expect(screen.getByTestId('authenticated').textContent).toBe('false');
  });

  test('useAuth throws when used outside an AuthProvider', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    expect(() => render(<AuthConsumer />)).toThrow('useAuth must be used within an AuthProvider');

    consoleError.mockRestore();
  });
});
