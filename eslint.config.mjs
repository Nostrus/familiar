import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      '.agents/**',
      '.cursor/**',
      '.github/skills/**',
      '.opencode/**',
      '.vscode/**',
      '**/dist/**',
      'node_modules/**',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ['**/*.{ts,tsx,js,jsx,mjs,cjs}'],
    languageOptions: {
      globals: {
        console: 'readonly',
        module: 'readonly',
        process: 'readonly',
      },
    },
    rules: {
      'no-console': 'off',
    },
  },
  {
    files: [
      '**/*.config.{js,cjs,mjs,ts,cts}',
      '**/jest.config.{js,cjs,mjs,ts,cts}',
      '**/jest.preset.{js,cjs,mjs,ts,cts}',
    ],
    languageOptions: {
      globals: {
        __dirname: 'readonly',
        require: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
      'no-undef': 'off',
    },
  },
);
