import * as SentrySDK from '@sentry/react-native'

export const reactNativeTracingRoutingInstrumentation = new SentrySDK.ReactNavigationInstrumentation({})
export const reactNativeTracingSampleRate = 0.1
export const reactNativeTracing = new SentrySDK.ReactNativeTracing({
  routingInstrumentation: reactNativeTracingRoutingInstrumentation,
})
