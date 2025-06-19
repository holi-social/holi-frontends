import { registerRootComponent } from 'expo'
import { ExpoRoot } from 'expo-router'
import React from 'react'

import 'react-native-get-random-values' // FIXME: remove this in favor of expo-crypto
import 'fast-text-encoding' // FIXME: Check if this is really needed (https://docs.expo.dev/versions/v52.0.0/sdk/encoding/)
import 'react-native-gesture-handler'
import 'react-native-reanimated'
import 'holi-bricks/styles/init'
import '@holi/mobile/lib/loadIntlPolyfills'

import { initSentry } from './lib/initSentry'

function main() {
  //@ts-ignore
  const ctx = require.context('./app')
  return <ExpoRoot context={ctx} />
}

const SentryInstrumentedApp = initSentry(main)
registerRootComponent(SentryInstrumentedApp)
