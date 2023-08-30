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
    const parsedUrl = new URL(url)
    if (parsedUrl.pathname === '/graphql') {
      // e.g. https://staging.unified.apis.holi.social/graphql?op=hasNewNotifications
      const graphQlOperation = parsedUrl.searchParams.get('op')
      // don't record 'hasNewNotifications',
      // because it spams our span trees (we do it repeatedly)
      return graphQlOperation !== 'hasNewNotifications'
    } else if (parsedUrl.pathname === '/_matrix/client/r0/sync') {
      // e.g. https://chat.holi.social/_matrix/client/r0/sync?filter={"room":{"timeline":{"unread_thread_notifications":true,"limit":8}}}&timeout=0&_cacheBuster=1693387473254&_=1693387473255 (encoded, initial sync)
      // e.g. https://chat.holi.social/_matrix/client/r0/sync?filter=0&timeout=30000&since=s779_10763_0_103_2_1_1_200_0_1&_=1693387473613 (long poll sync)
      const timeout = parseInt(parsedUrl.searchParams.get('timeout')) // may be NaN (param missing)
      const isHighTimeout = timeout > 500 // `false` if NaN
      // don't record high timeout calls,
      // because it expands our performance transactions artificially
      // (matrix sdk does them continuously)
      return !isHighTimeout
    } else {
      // only record actual calls to internet services (via https)
      // else there would be lots of local expo logs calls (via http)
      return parsedUrl.protocol.startsWith('https') // beware `protocol` may contain the ':'
    }
  },
})
