import * as Sentry from '@sentry/nextjs'

import sentryConfig from './sentry.config'

export function register() {
  Sentry.init({
    ...sentryConfig,
    enabled: false, // don't track server side stuff, e.g. page impressions. Server side is logged and monitored in google cloud
  })
}
