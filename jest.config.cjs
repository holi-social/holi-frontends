module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': 'babel-jest',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['e2e'],
  setupFiles: ['<rootDir>/jest.setup.js'],
}
