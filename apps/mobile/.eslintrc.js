module.exports = {
  extends: ['../../.eslintrc.js'],
  root: false,
  ignorePatterns: ['dist', '.expo', '.turbo', 'node_modules'],
  settings: {
    next: {
      rootDir: 'web',
    },
  },
}
