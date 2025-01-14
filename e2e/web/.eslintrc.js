module.exports = {
  extends: ['../../.eslintrc.js'],
  root: false,
  ignorePatterns: ['node_modules', 'playwright-report'],
  rules: {
    'no-restricted-imports': 'off',
  },
}
