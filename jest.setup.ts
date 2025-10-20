import { jest } from '@jest/globals'
import { initializeBricks } from 'holi-bricks/config'
import { initReactI18next } from 'react-i18next'
import mockSafeAreaContext from 'react-native-safe-area-context/jest/mock'
// @ts-ignore
import mockClipboard from '@react-native-clipboard/clipboard/jest/clipboard-mock.js'
import 'react-native-gesture-handler/jestSetup'

import i18n from '@holi/core/i18n'
import type { TrackingEventHandler, TrackingHook } from '@holi/core/tracking/types'

import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'

// Adds Apollo dev messages
loadDevMessages()
loadErrorMessages()

import 'react-native-gesture-handler/jestSetup'
// Added to fix the following error: https://github.com/facebook/react-native/issues/42904#issuecomment-2306382117
// eslint-disable-next-line @typescript-eslint/no-var-requires, @typescript-eslint/no-unused-vars
const { Switch } = require('react-native')
// Added to fix the following error: https://stackoverflow.com/questions/70506663/invariant-violation-new-nativeeventemitter-requires-a-non-null-argument
jest.mock('react-native/Libraries/EventEmitter/NativeEventEmitter')

jest.mock('@react-native-clipboard/clipboard', () => mockClipboard)

jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock')
  const React = require('react')

  const makeBuilder = () => {
    const builder: any = new Proxy(() => builder, {
      get: (target, prop) => {
        if (prop === 'createInstance') {
          return () => builder
        }

        return () => builder
      },
      apply: () => builder,
    })
    return builder
  }

  const animation = makeBuilder()

  return {
    ...Reanimated,
    FadeIn: animation,
    FadeOut: animation,
    FadeInRight: animation,
    FadeOutRight: animation,
    FadeInUp: animation,
    FadeOutUp: animation,
    FadeInDown: animation,
    FadeOutDown: animation,
    FadeInLeft: animation,
    FadeOutLeft: animation,
    SlideInRight: animation,
    SlideOutRight: animation,
    SlideInLeft: animation,
    SlideOutLeft: animation,
    SlideInUp: animation,
    SlideOutUp: animation,
    SlideInDown: animation,
    SlideOutDown: animation,
    LayoutAnimationConfig: ({ children }: { children: React.ReactNode }) => children,
  }
})

// eslint-disable-next-line @typescript-eslint/no-var-requires
require('react-native-reanimated').setUpTests()

require('@shopify/flash-list/jestSetup')

initializeBricks()

global.captureSentryException = jest.fn()

global.mockSetOptions = jest.fn()
global.mockOpenURL = jest.fn()
global.mockOpenToast = jest.fn()
global.mockTrack = jest.fn()

global.TextEncoder = jest.fn<() => TextEncoder>()

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
import NativeEventEmitter from 'react-native/Libraries/EventEmitter/NativeEventEmitter'
import type { Platform } from 'react-native'

NativeEventEmitter.prototype.addListener._protoImpl = () => {
  return { remove: jest.fn() }
}
jest.mock('react-native/Libraries/Utilities/Platform', () => {
  const mockPlatform = jest.requireActual<Platform>('react-native/Libraries/Utilities/Platform')
  mockPlatform.OS = 'android'
  return mockPlatform
})

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
