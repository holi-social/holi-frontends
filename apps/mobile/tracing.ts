import * as Sentry from '@sentry/react-native'

export const reactNativeTracing = Sentry.reactNativeTracingIntegration({
  // use `beforeNavigate` to drop or modify the transaction, if you need that
  // use `shouldCreateSpanForRequest` to drop unwanted spans, like health endpoints or recurring requests
  /** @param {string} url */
  shouldCreateSpanForRequest: (url) => {
    try {
      const parsedUrl = new URL(url)
      if (parsedUrl.pathname === '/graphql') {
        // e.g. https://staging.unified.apis.holi.social/graphql?op=hasNewNotifications
        const graphQlOperation = parsedUrl.searchParams.get('op')
        // don't record 'hasNewNotifications',
        // because it spams our span trees (we do it repeatedly)
        return graphQlOperation !== 'hasNewNotifications'
      }
      if (parsedUrl.pathname === '/_matrix/client/v3/sync') {
        // e.g. https://chat.holi.social/_matrix/client/v3/sync?filter={"room":{"timeline":{"unread_thread_notifications":true,"limit":8}}}&timeout=0&_cacheBuster=1693387473254&_=1693387473255 (encoded, initial sync)
        // e.g. https://chat.holi.social/_matrix/client/v3/sync?filter=0&timeout=30000&since=s779_10763_0_103_2_1_1_200_0_1&_=1693387473613 (long poll sync)
        const timeout = String(parsedUrl?.searchParams?.get('timeout')) // may be NaN (param missing)
        const isHighTimeout = Number.parseInt(timeout) > 500 // `false` if NaN
        // don't record high timeout calls,
        // because it expands our performance transactions artificially
        // (matrix sdk does them continuously)
        return !isHighTimeout
      }

      // only record actual calls to internet services (via https)
      // else there would be lots of local expo logs calls (via http)
      return parsedUrl.protocol.startsWith('https') // beware `protocol` may contain the ':'
    } catch (e) {
      // only happens with relative (which should not be used in mobile) or broken urls
      return url.startsWith('https')
    }
  },
})

export const navigationIntegration = Sentry.reactNavigationIntegration({
  enableTimeToInitialDisplay: true,
})

// TODO: Enable SessionReplay in the future. For now, let's keep it disabled
// due to a small performance overhead. Given the current performance
// state of the app, it's best not to add any additional overhead on top of what we already have.
// https://docs.sentry.io/platforms/react-native/session-replay/
