import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.js'],
    globals: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/main.jsx'],
      // Floor, not a target -- set just under the baseline measured when this
      // was added (24.02/23.55/17.65/25.24%) so CI fails on regression, not
      // on normal fluctuation. Ratchet these up as more tests are added.
      thresholds: {
        statements: 20,
        branches: 20,
        functions: 15,
        lines: 20,
      },
    },
  },
});
