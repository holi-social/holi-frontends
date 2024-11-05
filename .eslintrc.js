module.exports = {
  settings: {
    react: {
      version: '18.2.0',
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
  plugins: ['react', 'react-native', 'react-hooks', '@typescript-eslint', 'prettier'],
  rules: {
    'prettier/prettier': ['error'],
    'linebreak-style': ['error', 'unix'],
    quotes: ['error', 'single', { avoidEscape: true }],
    semi: ['error', 'never'],
    '@typescript-eslint/ban-ts-comment': 'off',
    '@typescript-eslint/no-unused-vars': ['error'],
    '@typescript-eslint/no-explicit-any': ['error'],
    'no-restricted-imports': [
      'error',
      {
        // Allows relative imports only within the current directory, forbids all other relative imports
        // Also forbid imports to yarn workspaces without @holi prefix as this breaks mobile builds
        patterns: ['..*', 'core/*', 'packages/*', 'holi-apps/*'],
        paths: [
          {
            name: 'react-native',
            importNames: ['Text', 'TextProps', 'Button'],
            message: 'Please use components from holi-bricks instead.',
          },
          {
            name: 'react-native',
            importNames: ['SafeAreaView'],
            message: 'Please use SafeArea from packages/ui instead.',
          },
          {
            name: 'react-native-unistyles',
            importNames: ['createStyleSheet', 'useStyles'],
            message: 'Please use hooks and utils from holi-bricks instead.',
          },
        ],
      },
    ],
    'react-hooks/rules-of-hooks': 'error', // Checks rules of Hooks
    'react-hooks/exhaustive-deps': [
      'error',
      {
        additionalHooks: 'useIsomorphicLayoutEffect',
      },
    ], // Checks effect dependencies
    'react/self-closing-comp': [
      'error',
      {
        component: true,
        html: true,
      },
    ],
    // Use logError hook for errors; debug logs are only visible in development builds
    'no-console': ['error', { allow: ['debug'] }],
    'react/prop-types': 'off',
  },
  ignorePatterns: ['**/__generated__/*', 'apps/mobile/android/**', 'apps/mobile/ios/**'],
}
