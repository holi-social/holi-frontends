import * as Sentry from 'sentry-expo'

export const reactNativeTracingRoutingInstrumentation = new Sentry.Native.ReactNavigationInstrumentation({})
export const reactNativeTracingSampleRate = 0.1
export const reactNativeTracing = new Sentry.Native.ReactNativeTracing({
  routingInstrumentation: reactNativeTracingRoutingInstrumentation,
})
