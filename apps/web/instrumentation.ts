import * as Sentry from '@sentry/nextjs'

import sentryConfig from './sentry.config'

export function register() {
  Sentry.init(sentryConfig)
}
