/**
 * For a detailed explanation regarding each configuration property, visit:
 * https://jestjs.io/docs/configuration
 */
import type { Config } from 'jest'

const config: Config = {
  preset: 'react-native',
  setupFiles: ['<rootDir>/jest.setup.ts'],
  clearMocks: true,
  // collectCoverage: true,
  // coverageDirectory: ".coverage",
  testEnvironment: 'jsdom',
  moduleNameMapper: {
    'holi-bricks/(.*)': '<rootDir>/$1',
  },
  setupFilesAfterEnv: ['<rootDir>/jest.setupAfterEnv.ts'],
  transformIgnorePatterns: [
    'node_modules/(?!((jest-)?react-native|@react-native(-community)?)|expo(nent)?|@expo(nent)?/.*|@expo-google-fonts/.*|react-navigation|@react-navigation/.*|@unimodules/.*|unimodules|@sentry/react-native|react-native-svg/.*)',
  ],
  testEnvironmentOptions: {
    url: 'http://localhost',
  },
}

export default config
