import * as Sentry from '@sentry/react-native'
import { CombinedGraphQLErrors, CombinedProtocolErrors, ServerError, ServerParseError } from '@apollo/client'
import { HoliError } from '@holi/core/errors/classes/HoliError'
import { environment } from '@holi/core/helpers/environment'
import { CodedError } from '@holi/mobile/expo-error'
import { navigationIntegration, reactNativeTracing } from '@holi/mobile/tracing'
import type { ComponentType } from 'react'
import { config } from '@holi/mobile/config'

const debugSentry = false

export function initSentry(element: ComponentType<Record<string, unknown>>): ReturnType<typeof Sentry.wrap> {
  Sentry.init({
    dsn: config.sentry.dsn,
    enabled: !__DEV__,
    enableAppHangTracking: true,
    environment: environment,
    debug: debugSentry, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event.
    onReady: (response) => {
      // helpful to determine if sentry works in production app!
      // eslint-disable-next-line no-console
      console.log(
        response?.didCallNativeInit ? 'Sentry successfully initialized in env ' + environment : 'Sentry not initialized'
      )
    },
    beforeSend: (event, hint) => {
      const exception = hint.originalException

      // The right-hand side operators of instanceof must be objects, otherwise an exception is thrown.
      // Throwing an exception is not what you want to do in exception handling code, because it will hide the original error.
      // Examples of this problem:
      // https://holistic-foundation.sentry.io/issues/4238280229/?project=6396737&query=is%3Aunresolved&referrer=issue-stream&stream_index=0
      // https://holistic-foundation.sentry.io/issues/4188987374/?project=6377191&query=is%3Aunresolved&referrer=issue-stream&stream_index=0
      try {
        if (
          CombinedGraphQLErrors.is(exception) ||
          CombinedProtocolErrors.is(exception) ||
          ServerParseError.is(exception) ||
          ServerError.is(exception)
        ) {
          event.fingerprint = ['{{ default }}', 'apollo-client-error', String(exception.message)]
        } else if (exception instanceof HoliError) {
          event.fingerprint = ['{{ default }}', 'holi-client-error']
        } else if (exception instanceof CodedError) {
          event.fingerprint = ['{{ default }}', 'expo-client-error', String(exception?.code)]
        }
      } catch (e) /* eslint-disable-line @typescript-eslint/no-unused-vars */ {
        // do nothing, see comment above try-block.
      }

      return event
    },
    integrations: [reactNativeTracing, navigationIntegration],
    tracePropagationTargets: ['localhost', /^\//, /(^|\.)holi\.social$/], // enable tracePropagationTargets to apex domain and subdomains
    enableAppStartTracking: true,
    enableNativeFramesTracking: true,
    enableStallTracking: true,
    enableUserInteractionTracing: true,
    tracesSampleRate: debugSentry ? 1 : 0.3,
    profilesSampleRate: debugSentry ? 1 : 0.3,
  })

  return Sentry.wrap(element)
}
