// This file configures the initialization of Sentry on the browser.
// The config you add here will be used whenever a page is visited.
// https://docs.sentry.io/platforms/javascript/guides/nextjs/
import { ApolloError } from '@apollo/client'
import * as Sentry from '@sentry/nextjs'

import { HoliError } from '@holi/core/errors/classes/HoliError'

import sentryConfig from './sentry.config'

Sentry.init({
  ...sentryConfig, // ...
  // Note: if you want to override the automatic release value, do not set a
  // `release` value here - use the environment variable `SENTRY_RELEASE`, so
  // that it will also get attached to your source maps
  beforeSend: (event, hint) => {
    const exception = hint.originalException

    // The right-hand side operators of instanceof must be objects, otherwise an exception is thrown.
    // Throwing an exception is not what you want to do in exception handling code, because it will hide the original error.
    // Examples of this problem:
    // https://holistic-foundation.sentry.io/issues/4238280229/?project=6396737&query=is%3Aunresolved&referrer=issue-stream&stream_index=0
    // https://holistic-foundation.sentry.io/issues/4188987374/?project=6377191&query=is%3Aunresolved&referrer=issue-stream&stream_index=0
    // TODO(SF) fix this
    try {
      if (exception instanceof ApolloError) {
        event.fingerprint = ['{{ default }}', 'apollo-client-error', String(exception.networkError)]
      } else if (exception instanceof HoliError) {
        event.fingerprint = ['{{ default }}', 'holi-client-error']
      }
    } catch (e) {
      // do nothing, see comment above try-block.
    }

    return event
  },
})
