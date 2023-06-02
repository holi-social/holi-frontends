import { ApolloError } from '@apollo/client'
import { RequiredError } from '@ory/client'

import { HoliError } from '@holi/core/errors/classes/HoliError'

import { environmentId } from './environment'

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN
const SENTRY_ENVIRONMENT = environmentId || process.env.NODE_ENV

const sentryConfig = {
  dsn: SENTRY_DSN || 'https://25eadef1cf0444c6bab1eec8d9acaacc@o949544.ingest.sentry.io/6396737',
  // Adjust this value in production, or use tracesSampler for greater control
  tracesSampleRate: 0.05,
  enabled: ['production'].includes(SENTRY_ENVIRONMENT),
  environment: SENTRY_ENVIRONMENT,
  // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  beforeSend: function (event, hint) {
    const exception = hint.originalException

    if (exception instanceof ApolloError) {
      event.fingerprint = ['{{ default }}', 'apollo-client-error', String(exception.networkError)]
    } else if (exception instanceof RequiredError) {
      event.fingerprint = ['{{ default }}', 'ory-client-error']
    } else if (exception instanceof HoliError) {
      event.fingerprint = ['{{ default }}', 'holi-client-error']
    }

    return event
  },
}

export default sentryConfig
