/* eslint-env node */

module.exports = {
  root: true,
  env: { browser: true, es2020: true, node: true },
  settings: {
    react: {
      version: 'detect',
    },
  },
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react-hooks/recommended',
    'plugin:react/jsx-runtime',
    'plugin:jsx-a11y/recommended',
    'plugin:import/recommended',
    'airbnb',
    'airbnb-typescript',
    'prettier',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs', 'vite.config.ts'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: true,
    tsconfigRootDir: __dirname,
  },
  plugins: [
    'prettier',
    'react',
    '@typescript-eslint',
    'jsx-a11y',
    'react-hooks',
    'react-refresh',
    'import',
  ],
  rules: {
    'react/function-component-definition': [
      2,
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    'import/extensions': ['error', 'never'],
    // 'import/no-absolute-path': 'off',
    // 'import/prefer-default-export': 'off',
    'react/react-in-jsx-scope': 'off',
    'react-refresh/only-export-components': [
      'warn',
      { allowConstantExport: true },
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    'react/button-has-type': 'off',
    'react/jsx-filename-extension': [
      1,
      { extensions: ['.js', '.jsx', '.tsx', 'ts'] },
    ],
    'react/require-default-props': [0],
    'react/jsx-props-no-spreading': 0,
    'jsx-a11y/media-has-caption': 0,
    'no-console': 0,
    'react/no-array-index-key': 0,
  },
};
