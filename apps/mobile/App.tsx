import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { BricksTheme } from 'holi-bricks/components/bricks-theme'
import 'holi-bricks/libs/init'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import { initializeMobileApolloClient } from '@holi/api/graphql/client'
import { initAuth } from '@holi/core/auth/helpers/init'
import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { initI18n } from '@holi/core/i18n'
import RootProvider from '@holi/core/providers/RootProvider'
import { subscribeToDeviceTokenChanges } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { config } from '@holi/mobile/config'
import NavigationProvider from '@holi/mobile/navigation/NavigationProvider'
import RootNavigator from '@holi/mobile/navigation/RootNavigator'
import { initNotifications } from '@holi/mobile/notifications/initNotifications'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'

const logger = getLogger('AppInit')

SplashScreen.preventAutoHideAsync()

/*
commented out as the background handler is currently not doing anything other than logging for demonstration purposes
registerHandleNotificationsWhenAppIsInBackground().catch((error) =>
  logError(error, 'Failed to register notifications backgound task', {
    location: 'App.registerHandleNotificationsWhenAppIsInBackground',
  })
)*/

logger.debug('App', 'starting app with config', config)

const apolloClient = initializeMobileApolloClient()

const App = () => {
  const [isReady, setIsReady] = useState(false)
  const [initDone, setInitDone] = useState(false)

  // Android requires importing Intl polyfills to use APIs such as RelativeTimeFormat
  if (Platform.OS !== 'web') {
    require('@formatjs/intl-locale/polyfill')
    require('@formatjs/intl-relativetimeformat/polyfill')
    require('@formatjs/intl-relativetimeformat/locale-data/en')
    require('@formatjs/intl-relativetimeformat/locale-data/de')
    require('@formatjs/intl-pluralrules/polyfill')
    require('@formatjs/intl-pluralrules/locale-data/en')
    require('@formatjs/intl-pluralrules/locale-data/de')
  }

  // HOLI-9792: Remove when moving font to app.config.js
  const fonts = {
    ['Circular Std Book']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-Book.otf'),
    ['Circular Std Book Italic']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-BookItalic.otf'),
    ['Circular Std Medium']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-Medium.otf'),
    ['Circular Std Medium Italic']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-MediumItalic.otf'),
    ['InstrumentSans-Regular']: require('holi-bricks/components/text/fonts/InstrumentSans-Regular.ttf'),
    ['InstrumentSans-Medium']: require('holi-bricks/components/text/fonts/InstrumentSans-Medium.ttf'),
  }

  const [fontsLoaded] = useFonts(fonts)

  const init = async () => {
    try {
      await Promise.all([initI18n(), initAuth(), initNotifications()])
    } catch (error) {
      logError(error, 'Error initializing the app', { location: 'App.init' })
    } finally {
      setInitDone(true)
    }
  }

  useEffect(() => {
    init()

    return subscribeToDeviceTokenChanges()
  }, [])

  useEffect(() => {
    if (fontsLoaded && initDone) {
      setIsReady(true)
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, initDone])

  if (!isReady) return null

  return (
    <BricksTheme initialTheme={'light'}>
      <ThemeProvider theme={defaultHoliTheme}>
        <NavigationProvider>
          <RootProvider apolloClient={apolloClient}>
            <RootNavigator />
          </RootProvider>
        </NavigationProvider>
      </ThemeProvider>
    </BricksTheme>
  )
}

export default App
