import { registerRootComponent } from 'expo'
import 'react-native-gesture-handler'
import 'react-native-url-polyfill/auto'
import * as Sentry from 'sentry-expo'

import App from './App'

Sentry.init({
  dsn: 'https://0e50481f84454f9a838a8217085498f0@o949544.ingest.sentry.io/6377191',
  enableInExpoDevelopment: true,
  debug: false, // If `true`, Sentry will try to print out useful debugging information if something goes wrong with sending the event. Set it to `false` in production
})

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in Expo Go or in a native build,
// the environment is set up appropriately
registerRootComponent(App)
