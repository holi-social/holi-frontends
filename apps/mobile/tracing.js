import * as Sentry from 'sentry-expo'

export const reactNativeTracingRoutingInstrumentation = new Sentry.Native.ReactNavigationInstrumentation({})
export const reactNativeTracing = new Sentry.Native.ReactNativeTracing({
  enableStallTracking: true,
  enableNativeFramesTracking: true,
  tracePropagationTargets: ['localhost', /^\//, 'holi.social'],
  routingInstrumentation: reactNativeTracingRoutingInstrumentation,
  // use `beforeNavigate` to drop or modify the transaction, if you need that
  // use `shouldCreateSpanForRequest` to drop unwanted spans, like health endpoints or recurring requests
})
