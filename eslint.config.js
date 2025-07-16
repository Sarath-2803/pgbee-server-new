import eslintPluginTs from '@typescript-eslint/eslint-plugin';
import parserTs from '@typescript-eslint/parser';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import js from '@eslint/js';

export default [
  js.configs.recommended,

  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      globals: {
        process: 'readonly',
      },
      parser: parserTs,
      parserOptions: {
        project: true, // Automatically detects tsconfig.json
        tsconfigRootDir: './',
        sourceType: 'module',
      },
    },
    plugins: {
      '@typescript-eslint': eslintPluginTs,
    },
    rules: {
      ...eslintPluginTs.configs.recommended.rules,
    },
  },

  // React-specific settings
  {
    files: ['client/**/*.{ts,tsx}'],
    languageOptions: {
      parserOptions: {
        project: './client/tsconfig.eslint.json',
      },
      globals: {
        process: 'readonly',
        window: true,
        document: true,
      },
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      ...pluginReact.configs.recommended.rules,
      ...pluginReactHooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off', // React 17+
    },
  },

  // Server-specific Node.js environment
  {
    files: ['server/**/*.ts'],
    languageOptions: {
      globals: {
        process: 'readonly',
        window: 'readonly',
        document: 'readonly',
        console: 'readonly',
      },
    },
  },
];
