import { ApolloError } from '@apollo/client'
import * as Sentry from '@sentry/react-native'

import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'
import React from 'react'
import 'fast-text-encoding'
// Polyfill for Intl including required locale data
import 'intl'
import 'intl/locale-data/jsonp/de'
import 'intl/locale-data/jsonp/en'
import 'react-native-gesture-handler'
import 'react-native-get-random-values' // Polyfill for uuid

import 'react-native-reanimated'
import 'holi-bricks/styles/init'

import { HoliError } from '@holi/core/errors/classes/HoliError'
import { environment } from '@holi/core/helpers/environment'

import { config } from './config'
import { CodedError } from './expo-error'
import { navigationIntegration, reactNativeTracing } from './tracing'

// Only set this to `true` if on a dev client! Keep this `false` in all commits!
// (`enableInExpoDevelopment: true` crashes on expo go)
const debugSentry = false

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
      if (exception instanceof ApolloError) {
        event.fingerprint = ['{{ default }}', 'apollo-client-error', String(exception.networkError)]
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
  tracesSampleRate: debugSentry ? 1 : 0.1,
  profilesSampleRate: debugSentry ? 1 : 0.1,
})

// Must be exported or Fast Refresh won't update the context
export function App() {
  //@ts-ignore
  const ctx = require.context('./app')
  return <ExpoRoot context={ctx} />
}

const SentryInstrumentedApp = Sentry.wrap(App)
// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(SentryInstrumentedApp)
