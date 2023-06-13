import { ApolloError } from '@apollo/client'
import { CodedError, registerRootComponent } from 'expo'
import Constants from 'expo-constants'
// Polyfill for Intl including required locale data
import 'intl'
import 'intl/locale-data/jsonp/de'
import 'intl/locale-data/jsonp/en'
import 'react-native-gesture-handler'
import 'react-native-url-polyfill/auto'
import * as Sentry from 'sentry-expo'

import { HoliError } from '@holi/core/errors/classes/HoliError'

import App from './App'

export const sentryEnvironment = Constants.manifest?.extra?.environment || process.env.NODE_ENV
export const sentryDsn = Constants.manifest?.extra?.sentry.dsn

Sentry.init({
  dsn: sentryDsn || 'https://0e50481f84454f9a838a8217085498f0@o949544.ingest.sentry.io/6377191',
  enableInExpoDevelopment: ['production'].includes(sentryEnvironment),
  environment: sentryEnvironment,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  beforeSend: function (event, hint) {
    const exception = hint.originalException

    // The right-hand side operators of instanceof must be objects, otherwise an exception is thrown.
    // Throwing an exception is not what you want to do in exception handling code, because it will hide the original error.
    // Examples of this problem:
    // https://holistic-foundation.sentry.io/issues/4238280229/?project=6396737&query=is%3Aunresolved&referrer=issue-stream&stream_index=0
    // https://holistic-foundation.sentry.io/issues/4188987374/?project=6377191&query=is%3Aunresolved&referrer=issue-stream&stream_index=0
    try {
      if (exception instanceof ApolloError) {
        event.fingerprint = ['{{ default }}', 'apollo-client-error', String(exception.networkError)]
      } else if (exception instanceof HoliError) {
        event.fingerprint = ['{{ default }}', 'holi-client-error']
      } else if (exception instanceof CodedError) {
        event.fingerprint = ['{{ default }}', 'expo-client-error', String(exception.code)]
      }
    } catch (e) {
      // do nothing, see comment above try-block.
    }

    return event
  },
})

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
