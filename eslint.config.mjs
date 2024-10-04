import { defineConfig } from 'eslint-define-config';
import globals from 'globals';
import tseslint from '@typescript-eslint/eslint-plugin';
import eslintPluginPrettier from 'eslint-plugin-prettier';

export default defineConfig([
  // Global ignores
  {
    ignores: ['node_modules/', 'dist/', 'build/'], // Add your ignored paths here
  },

  // Backend-specific configuration
  {
    files: ['./back-end/**/*.{js,mjs,cjs,ts}'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      prettier: eslintPluginPrettier,
    },
    rules: {
      'prettier/prettier': 'warn',
    },
  },
]);
