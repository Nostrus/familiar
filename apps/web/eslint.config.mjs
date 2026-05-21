import nextEslintPluginNext from '@next/eslint-plugin-next';
import nx from '@nx/eslint-plugin';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import baseConfig from '../../eslint.config.mjs';

export default [
  {
    plugins: { '@next/next': nextEslintPluginNext },
    rules: {
      ...nextEslintPluginNext.configs.recommended.rules,
      ...nextEslintPluginNext.configs['core-web-vitals'].rules,
    },
  },
  ...nx.configs['flat/react-typescript'],
  ...baseConfig,
  {
    files: ['**/*.{ts,tsx,js,jsx}'],
    plugins: { 'jsx-a11y': jsxA11y },
    rules: {
      'jsx-a11y/alt-text': ['error', { img: ['Image'] }],
      'jsx-a11y/label-has-associated-control': 'error',
    },
  },
  {
    files: ['specs/**'],
    rules: {
      '@next/next/no-img-element': 'off',
    },
  },
  {
    ignores: ['.next/**/*', '**/out-tsc'],
  },
];
