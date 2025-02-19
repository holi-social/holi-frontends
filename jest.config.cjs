module.exports = {
  verbose: true,
  preset: 'jest-expo',
  transform: {
    '^.+\\.jsx$': 'babel-jest',
    '^.+\\.tsx?$': 'babel-jest',
    '\\.(jpg|jpeg|png|gif|eot|otf|webp|svg|ttf|woff|woff2|mp4|webm|wav|mp3|m4a|aac|oga)$':
      '<rootDir>/jestFileTransformer.cjs',
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
  modulePathIgnorePatterns: ['e2e', 'testData', 'mocks.ts', 'TestBed.tsx', 'testutils.ts'],
  testPathIgnorePatterns: ['/node_modules/', '__tests__/helpers'],
  moduleNameMapper: {
    '\\.(css|scss)$': '<rootDir>/jest.styleMock.cjs',
    // Force module uuid to resolve with the CJS entry point, because Jest does not support package.json.exports. See https://github.com/uuidjs/uuid/issues/451
    '^uuid$': 'uuid',
    '\\.(lottie)$': '<rootDir>/__mocks__/lottieMock.js',
  },
  setupFiles: [
    '<rootDir>/jest.setup.ts',
    '<rootDir>/jest.setup.chat.ts',
    '<rootDir>/node_modules/jest-offline',
    '<rootDir>/node_modules/react-native-gesture-handler/jestSetup.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/jest.setup-after-env.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|@sentry/react-native|native-base|react-native-svg|matrix-js-sdk|matrix-js-sdk/.*)',
  ],
  resetMocks: true,
}
