import { ApolloError } from '@apollo/client'
import { RequiredError } from '@ory/client'
import * as SentrySDK from '@sentry/react-native'
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
export const routingInstrumentation = new SentrySDK.ReactNavigationInstrumentation({})
const tracesSampleRate = ['staging', 'production'].includes(sentryEnvironment) ? 0.01 : 0.1

Sentry.init({
  dsn: sentryDsn || 'https://0e50481f84454f9a838a8217085498f0@o949544.ingest.sentry.io/6377191',
  enableInExpoDevelopment: ['production'].includes(sentryEnvironment),
  environment: sentryEnvironment,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
  beforeSend: function (event, hint) {
    const exception = hint.originalException

    if (exception instanceof ApolloError) {
      event.fingerprint = ['{{ default }}', 'apollo-client-error', String(exception.networkError)]
    } else if (exception instanceof CodedError) {
      event.fingerprint = ['{{ default }}', 'expo-client-error', String(exception.code)]
    } else if (exception instanceof RequiredError) {
      event.fingerprint = ['{{ default }}', 'ory-client-error']
    } else if (exception instanceof HoliError) {
      event.fingerprint = ['{{ default }}', 'holi-client-error']
    }

    return event
  },
  integrations: [
    new SentrySDK.ReactNativeTracing({
      routingInstrumentation,
    }),
  ],
  tracesSampleRate: tracesSampleRate,
})

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App(routingInstrumentation))
