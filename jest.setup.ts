import { jest } from '@jest/globals'
import { initializeBricks } from 'holi-bricks/config'
import { initReactI18next } from 'react-i18next'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'
// @ts-ignore
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js'

import i18n from '@holi/core/i18n'
import type { TrackingEventHandler, TrackingHook } from '@holi/core/tracking/types'

import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'

// Adds Apollo dev messages
loadDevMessages()
loadErrorMessages()

// Added to fix the following error: https://github.com/facebook/react-native/issues/42904#issuecomment-2306382117
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars
const { Switch } = require('react-native')
// Added to fix the following error: https://stackoverflow.com/questions/70506663/invariant-violation-new-nativeeventemitter-requires-a-non-null-argument
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard)

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('react-native-reanimated').setUpTests()

require('@shopify/flash-list/jestSetup')

initializeBricks()

global.mockNavigate = jest.fn()
global.mockBack = jest.fn()
global.captureSentryException = jest.fn()

global.mockSetOptions = jest.fn()
global.mockOpenURL = jest.fn()
global.mockOpenToast = jest.fn()
global.mockTrack = jest.fn()

global.TextEncoder = jest.fn<() => TextEncoder>()

// NOTE: Expo Router recommends using renderRouter() from 'expo-router/testing-library'
// for testing routing behavior. However, most of our tests are component tests that just
// need navigation mocks to work. For our tests, we use this global mock.
// For tests that need actual routing behavior, use renderRouter() instead.
// See: https://docs.expo.dev/router/reference/testing/
jest.mock('expo-router', () => {
  const React = require('react')
  return {
    useRouter: () => ({
      push: global.mockNavigate,
      replace: global.mockNavigate,
      back: global.mockBack,
      canGoBack: jest.fn(() => true),
      setParams: jest.fn(),
    }),
    useNavigation: () => ({
      navigate: global.mockNavigate,
      setOptions: global.mockSetOptions,
      canGoBack: jest.fn(() => true),
      goBack: jest.fn(),
      isFocused: jest.fn(() => true),
    }),
    usePathname: () => '/',
    useGlobalSearchParams: () => {
      const React = require('react')
      const { NavigationRouteContext } = require('@react-navigation/native')
      const route = React.useContext(NavigationRouteContext)
      return route?.params || {}
    },
    useLocalSearchParams: () => {
      const React = require('react')
      const { NavigationRouteContext } = require('@react-navigation/native')
      const route = React.useContext(NavigationRouteContext)
      return route?.params || {}
    },
    useSegments: () => [],
    useRootNavigationState: () => ({
      key: 'root',
      index: 0,
      routeNames: [],
      routes: [],
      type: 'stack',
      stale: false,
    }),
    Link: ({ children, href, onPress, asChild, style, ...props }: any) => {
      const handlePress = (e: any) => {
        // call child onpress if it exists (asChild pattern)
        const childOnPress = asChild && React.isValidElement(children) ? children.props?.onPress : undefined
        // Call the Link's onPress if provided
        const linkOnPress = onPress
        let preventNavigation = false
        if (childOnPress) {
          const result = childOnPress(e)
          if (result === false) {
            preventNavigation = true
          }
        }
        if (linkOnPress) {
          const result = linkOnPress(e)
          if (result === false) {
            preventNavigation = true
          }
        }

        // Only navigate if not prevented
        if (href && !preventNavigation && !e?.defaultPrevented) {
          global.mockNavigate(href)
        }
      }

      if (asChild && React.isValidElement(children)) {
        // while using asChild, clone the child with the enhanced onPress handler
        // and preserve accessibility props from the Link to the child for testing
        const { 'aria-label': ariaLabel, accessibilityLabel, testID, ...otherProps } = props
        return React.cloneElement(children as React.ReactElement<any>, {
          onPress: handlePress,
          ...(ariaLabel && !children.props['aria-label'] && { 'aria-label': ariaLabel }),
          ...(accessibilityLabel && !children.props.accessibilityLabel && { accessibilityLabel }),
          ...(testID && !children.props.testID && { testID }),
        })
      }

      return React.createElement('a', { ...props, style, onPress: handlePress }, children)
    },
    Redirect: () => null,
    Stack: {
      Screen: () => null,
    },
    Tabs: {
      Screen: () => null,
    },
  }
})

jest.mock('@react-navigation/native', () => {
  const actualNav = jest.requireActual('@react-navigation/native') as object
  return {
    ...actualNav,
    useIsFocused: () => true,
    useNavigation: () => ({
      navigate: global.mockNavigate,
      dispatch: jest.fn(),
      getState: jest.fn(() => ({
        routes: [{}],
        index: 0,
      })),
      setOptions: global.mockSetOptions,
      canGoBack: jest.fn(),
    }),
    useLinkTo: () => global.mockNavigate,
    useFocusEffect: (callback: () => unknown) => callback?.(),
    useScrollToTop: jest.fn(),
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

jest.mock('react-native/Libraries/Network/RCTNetworking')
jest.mock('react-native/Libraries/Settings/Settings', () => ({
  get: jest.fn(),
  set: jest.fn(),
}))
jest.mock('react-native-safe-area-context', () => mockSafeAreaContext)

jest.mock('@holi/core/components/ScrollBasedCallbackInvocation')

jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('react-native-keyboard-controller', () => require('react-native-keyboard-controller/jest'))

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

jest.mock('@holi/core/tracking/hooks/useTracking', () => {
  const originalModule = jest.requireActual<object>('@holi/core/tracking/hooks/useTracking')
  return {
    __esModule: true,
    ...originalModule,
    default(): TrackingHook {
      return {
        track: global.mockTrack as unknown as TrackingEventHandler,
      }
    },
  }
})

jest.mock('@holi/core/helpers/useFocusEffect', () => {
  return {
    __esModule: true,
    useFocusEffect: jest.fn(),
  }
})

export default {}
