import { jest } from '@jest/globals'
import { initReactI18next } from 'react-i18next'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'

import i18n from '@holi/core/i18n'

global.mockNavigate = jest.fn()
global.captureSentryException = jest.fn()

global.mockSetOptions = jest.fn()
global.mockOpenURL = jest.fn()
global.mockOpenToast = jest.fn()
global.TextEncoder = jest.fn()

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native') as object
  return {
    ...actualNav,
    useIsFocused: () => true,
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

jest.mock('expo-linking', () => {
  const module: typeof import('expo-linking') = {
    ...jest.requireActual('expo-linking'),
    createURL: jest.fn((path: string) => path),
  }

  return module
})

jest.mock('@sentry/react-native', () => ({
  captureException: global.captureSentryException,
}))

jest.mock('react-native/Libraries/Animated/NativeAnimatedHelper')

jest.mock('react-native/Libraries/Network/RCTNetworking')

jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)

jest.mock('@holi/core/components/ScrollBasedCallbackInvocation')

jest.mock('@holi/ui/components/molecules/HoliToastProvider', () => {
  const original = jest.requireActual('@holi/ui/components/molecules/HoliToastProvider') as object
  return {
    ...original,
    useToast: () => ({
      openToast: global.mockOpenToast,
    }),
  }
})

jest.mock('@holi/core/helpers/useSafeAreaInsets', () => ({
  useSafeAreaInsets: () => ({
    top: 0,
  }),
}))

jest.mock('@holi/api/config', () => ({
  holiNextJSApiUrl: 'https://localhost:3000',
}))

jest.mock('@holi/core/helpers/dynamicImport', () => ({
  dynamicImport: () => () => null,
}))

jest.mock('react-native-webview', () => ({
  default: () => jest.fn(),
}))

jest.mock('next/router', () => ({
  useRouter: () => jest.fn(),
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
