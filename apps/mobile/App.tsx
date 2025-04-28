import * as SplashScreen from 'expo-splash-screen'
import { BricksTheme } from 'holi-bricks/foundations/colors/themes/bricks-theme'
import 'holi-bricks/styles/init'
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
import { initNotifications } from '@holi/mobile/notifications/initNotifications'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { OnboardingAwaitingNavigator } from '@holi/mobile/navigation/OnboardingAwaitingNavigator'

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

  const init = async () => {
    try {
      await Promise.all([initI18n(), initAuth(), initNotifications()])
    } catch (error) {
      logError(error, 'Error initializing the app', { location: 'App.init' })
    } finally {
      setIsReady(true)
    }
  }

  useEffect(() => {
    init()

    return subscribeToDeviceTokenChanges()
  }, [])

  if (!isReady) return null

  return (
    <BricksTheme initialTheme={'light'}>
      <ThemeProvider theme={defaultHoliTheme}>
        <NavigationProvider>
          <RootProvider apolloClient={apolloClient}>
            <KeyboardProvider>
              <OnboardingAwaitingNavigator onReady={SplashScreen.hideAsync} />
            </KeyboardProvider>
          </RootProvider>
        </NavigationProvider>
      </ThemeProvider>
    </BricksTheme>
  )
}

export default App
