import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import prettierConfig from 'eslint-config-prettier';
import baseConfig from '../eslint.config.base.cjs';

export default [
  js.configs.recommended,
  {
    ignores: ['dist', 'build', 'node_modules'],
  },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      parserOptions: {
        ecmaFeatures: { jsx: true },
      },
      globals: {
        ...globals.browser,
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
    },
    rules: {
      ...baseConfig.rules,
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // not needed with the modern JSX runtime
      'react/prop-types': 'off', // this codebase doesn't use PropTypes anywhere
    },
    settings: {
      react: { version: 'detect' },
    },
  },
  prettierConfig,
];
