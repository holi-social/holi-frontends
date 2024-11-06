module.exports = {
  extends: ['../.eslintrc.js'],
  root: false,
  ignorePatterns: ['storybook-static', 'ondevice/storybook.requires.ts'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
        // Allows relative imports only within the current directory, forbids all other relative imports as this breaks mobile builds
        // Also forbid imports to holi specific packages
        patterns: ['..*', 'core/*', 'packages/*', 'holi-apps/*', '@holi/*', '!@holi/icons'],
        paths: [
          {
            name: 'react-native',
            importNames: ['Text', 'TextProps', 'Button'],
            message: 'Please use components from holi-bricks instead.',
          },
        ],
      },
    ],
  },
}
