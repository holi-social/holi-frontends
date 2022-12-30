import { initReactI18next } from 'react-i18next'

import i18n from '@holi/core/i18n'

global.mockNavigate = jest.fn()
global.captureSentryException = jest.fn()
global.console = {
  ...console,
  error: jest.fn(),
}
global.mockSetOptions = jest.fn()
global.mockOpenURL = jest.fn()

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native')
  return {
    ...actualNav,
    useNavigation: () => ({
      navigate: jest.fn(),
      dispatch: jest.fn(),
      getState: jest.fn(() => ({
        routes: [{}],
        index: 0,
      })),
      setOptions: global.mockSetOptions,
    }),
    useLinkTo: () => global.mockNavigate,
  }
})

jest.mock('react-native/Libraries/Linking/Linking', () => ({
  openURL: global.mockOpenURL,
}))

jest.mock('@sentry/react-native', () => ({
  captureException: global.captureSentryException,
}))

i18n.use(initReactI18next).init({
  lng: 'en',
  fallbackLng: 'en',

  // test execution requires namespace
  ns: ['test'],
  defaultNS: 'test',

  interpolation: {
    escapeValue: false,
  },
  compatibilityJSON: 'v3',

  resources: {},
})

export default {}
