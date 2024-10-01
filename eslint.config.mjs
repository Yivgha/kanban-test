import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint from '@typescript-eslint/eslint-plugin';
import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import { FlatCompat } from '@eslint/eslintrc';

const compat = new FlatCompat();

export default [
  // Backend-specific configuration
  {
    files: ['back-end/**/*.{js,mjs,cjs,ts}'],
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
      ...compat.extends('plugin:@typescript-eslint/recommended'),
      'prettier/prettier': 'warn',
    },
  },

  // Frontend-specific configuration
  {
    files: ['front-end/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
      },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': tseslint,
      react: eslintPluginReact,
      prettier: eslintPluginPrettier,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {},
    ...compat.extends('plugin:react/recommended'),
    ...compat.extends('plugin:@typescript-eslint/recommended'),
    'prettier/prettier': 'warn',
  },

  // Apply general recommended ESLint rules for both environments
  {
    files: ['**/*.js', '**/*.ts', '**/*.tsx', '**/*.jsx'],
    languageOptions: {
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...pluginJs.configs.recommended.rules, // General recommended ESLint rules
      ...eslintConfigPrettier.rules,
    },
  },
];
