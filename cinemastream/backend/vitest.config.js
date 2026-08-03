const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    environment: 'node',
    testTimeout: 15000,
    // Integration tests share one real Postgres database and each file's
    // beforeEach TRUNCATEs the tables it needs -- running files in parallel
    // would let one file's truncate wipe data another file is mid-test on.
    fileParallelism: false,
  },
});
