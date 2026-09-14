import { describe, test, expect } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { useLikedTitles } from '../../src/hooks/useLikedTitles';

// useLikedTitles is backed by a shared module-level store (createListStore)
// so that every mounted MovieCard reads/writes the same Set-backed snapshot
// instead of each keeping its own copy. These tests guard that sharing: a
// toggle from one hook instance must be immediately visible from a
// completely separate instance, with no remount needed.

function ProbeA() {
  const { isLiked, toggle } = useLikedTitles();
  return (
    <div>
      <span data-testid="a-liked">{String(isLiked(1))}</span>
      <button onClick={() => toggle({ id: 1, media_type: 'movie', title: 'One' })}>toggle-a</button>
    </div>
  );
}

function ProbeB() {
  const { isLiked } = useLikedTitles();
  return <span data-testid="b-liked">{String(isLiked(1))}</span>;
}

describe('useLikedTitles (shared store)', () => {
  test('toggle adds and removes an item, reflected by isLiked', async () => {
    render(<ProbeA />);
    expect(screen.getByTestId('a-liked').textContent).toBe('false');

    await act(async () => {
      screen.getByText('toggle-a').click();
    });
    expect(screen.getByTestId('a-liked').textContent).toBe('true');

    await act(async () => {
      screen.getByText('toggle-a').click();
    });
    expect(screen.getByTestId('a-liked').textContent).toBe('false');
  });

  test('a toggle in one component instance is immediately visible from another', async () => {
    render(
      <div>
        <ProbeA />
        <ProbeB />
      </div>
    );

    expect(screen.getByTestId('b-liked').textContent).toBe('false');

    await act(async () => {
      screen.getByText('toggle-a').click();
    });
    expect(screen.getByTestId('b-liked').textContent).toBe('true');

    // Leave the shared store as we found it for any other test in this file.
    await act(async () => {
      screen.getByText('toggle-a').click();
    });
    expect(screen.getByTestId('b-liked').textContent).toBe('false');
  });
});
