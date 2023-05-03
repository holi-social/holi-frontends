// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import * as Sentry from '@sentry/nextjs'

import sentryConfig from './sentry.config'

Sentry.init({
  ...sentryConfig,
  enabled: false, // don't track server side stuff, e.g. page impressions. Server side is logged and monitored in google cloud
})
