// Shared ESLint rules for both backend/ and frontend/. Kept as CommonJS
// (.cjs) specifically so it can be `require`d from backend's CJS config
// and `import`ed from frontend's ESM config without either side needing
// npm workspaces just to share one file.
module.exports = {
  rules: {
    'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'no-undef': 'error',
    'prefer-const': 'warn',
    eqeqeq: ['warn', 'smart'],
    'no-var': 'error',
  },
};
