const js = require('@eslint/js');
const globals = require('globals');
const prettierConfig = require('eslint-config-prettier');
const baseConfig = require('../eslint.config.base.cjs');

module.exports = [
  js.configs.recommended,
  {
    ignores: ['node_modules', 'db/seed.local.sql'],
  },
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'commonjs',
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...baseConfig.rules,
    },
  },
  {
    // Test files use Vitest, which runs on ESM regardless of the rest of
    // this CommonJS codebase.
    files: ['tests/**/*.js'],
    languageOptions: {
      sourceType: 'module',
    },
  },
  prettierConfig,
];
