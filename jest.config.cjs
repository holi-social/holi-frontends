module.exports = {
  preset: 'jest-expo',
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jestFileTransformer.cjs',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['e2e', 'testData', 'mocks'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/jest.styleMock.cjs',
  },
  setupFiles: ['<rootDir>/jest.setup.ts', '<rootDir>/node_modules/jest-offline'],
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.ts'],
  resetMocks: true,
}
