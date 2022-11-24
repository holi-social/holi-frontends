module.exports = {
  settings: {
    react: {
      version: '17.0.1',
    },
  },
  env: {
    browser: true,
    es2021: true,
    node: true,
  },
  extends: ['eslint:recommended', 'prettier', 'plugin:react/recommended', 'plugin:@typescript-eslint/recommended'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: '6',
    sourceType: 'module',
  },
  plugins: ['react', 'react-native', 'react-hooks', '@typescript-eslint', 'prefer-arrow', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'never'],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': ['error'],
    'prefer-arrow/prefer-arrow-functions': [
      'error',
      {
        disallowPrototype: true,
        singleReturnOnly: false,
        classPropertiesAllowed: false,
      },
    ],
    'no-restricted-imports': [
      'error',
      {
        // Allows relative imports only within the current directory, forbids all other relative imports
        // Also forbid imports to yarn workspaces without @holi prefix as this breaks mobile builds
        patterns: ['..*', 'core/*', 'packages/*', 'holi-apps/*'],
      },
    ],
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': 'error', // Checks effect dependencies
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
  },
}
