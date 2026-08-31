const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'node',
    testTimeout: 15000,
    // Integration tests share one real Postgres database and each file's
    // beforeEach TRUNCATEs the tables it needs -- running files in parallel
    // would let one file's truncate wipe data another file is mid-test on.
    fileParallelism: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'html', 'lcov'],
      include: ['src/**/*.js'],
      exclude: ['src/server.js'],
      all: true,
      // Floor, not a target -- set just under the baseline measured when this
      // was added (86.35/69.65/75.53/87.32%) so CI fails on regression, not
      // on normal fluctuation. Ratchet these up as more tests are added.
      thresholds: {
        statements: 82,
        branches: 62,
        functions: 70,
        lines: 82,
      },
    },
  },
});
