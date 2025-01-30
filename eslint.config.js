// @ts-check

import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierConfig from 'eslint-config-prettier';

const files = ["src/**/*.{js,jsx,ts,tsx}"];

export default [
  {
    ignores: ["**/*.test.{js,jsx,ts,tsx}"],
  },
  {
    ...eslint.configs.recommended,
    files,
  },
  ...tseslint.configs.recommended.map((config) => ({ ...config, ...{ files: files } })),
  {
    ...prettierConfig,
    files,
  },
  {
    rules: {
      "prefer-const": "off",
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/no-unused-vars": "off",
      '@typescript-eslint/prefer-as-const': 'off',
    }
  },
];