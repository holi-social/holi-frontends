import * as Sentry from 'sentry-expo'

export const reactNativeTracingRoutingInstrumentation = new Sentry.Native.ReactNavigationInstrumentation({})
export const reactNativeTracing = new Sentry.Native.ReactNativeTracing({
  enableStallTracking: true,
  enableNativeFramesTracking: true,
  tracePropagationTargets: ['localhost', /^\//, 'holi.social'],
  routingInstrumentation: reactNativeTracingRoutingInstrumentation,
  // use `beforeNavigate` to drop or modify the transaction, if you need that
  // use `shouldCreateSpanForRequest` to drop unwanted spans, like health endpoints or recurring requests
  /** @param {string} url */
  shouldCreateSpanForRequest: (url) => {
    // e.g. https://staging.unified.apis.holi.social/graphql?op=hasNewNotifications
    // TODO test this in debug with log and dev-client
    const parsedUrl = new URL(url)
    if (parsedUrl.pathname === '/graphql') {
      const graphQlOperation = parsedUrl.searchParams.get('op')
      // 'hasNewNotifications' spams our span trees, because we do it repeatedly
      return graphQlOperation !== 'hasNewNotifications'
    } else {
      // TODO also filter matrix sync calls with large timeout
      // only actual calls to internet services
      // http calls are mostly local expo logs
      return parsedUrl.protocol.startsWith('https') // beware `protocol` may contain the ':'
    }
  },
})
