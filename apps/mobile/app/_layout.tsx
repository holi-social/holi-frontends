import * as SplashScreen from 'expo-splash-screen'
import { BricksTheme } from 'holi-bricks/foundations/colors/themes/bricks-theme'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'
import { initializeMobileApolloClient } from '@holi/api/graphql/client'
import { Redirect, Slot, usePathname, Stack } from 'expo-router'
import { initAuth } from '@holi/core/auth/helpers/init'
import { logError } from '@holi/core/errors/helpers'
import { getLogger } from '@holi/core/helpers/logging'
import { initI18n } from '@holi/core/i18n'
import RootProvider from '@holi/core/providers/RootProvider'
import { subscribeToDeviceTokenChanges } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { config } from '@holi/mobile/config'
import { initNotifications } from '@holi/mobile/notifications/initNotifications'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import { KeyboardProvider } from 'react-native-keyboard-controller'
import { OnboardingAwaitingNavigator } from '@holi/mobile/navigation/OnboardingAwaitingNavigator'
import * as Appcues from '@appcues/react-native'
import { appcuesAccountId, appcuesAppId } from '@holi/core/helpers/config'

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

const redirects: { [key: string]: string } = {
  '/spenden': '/donations',
  '/ehrenamt': '/volunteering',
  '/spaces/(.+)/aufgaben': '/spaces/$1/tasks',
}

const handleRedirects = (pathname: string): string =>
  Object.keys(redirects).reduce((path, rule) => path.replace(new RegExp(`^${rule}`), redirects[rule] ?? ''), pathname)

const App = () => {
  const [isReady, setIsReady] = useState(false)
  const pathname = usePathname()

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
      await Promise.all([initI18n(), initAuth(), initNotifications(), Appcues.setup(appcuesAccountId, appcuesAppId)])
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

  const redirectedPath = handleRedirects(pathname)
  if (pathname !== redirectedPath) {
    return <Redirect href={redirectedPath} />
  }

  return (
    <BricksTheme initialTheme={'light'}>
      <ThemeProvider theme={defaultHoliTheme}>
        <RootProvider apolloClient={apolloClient}>
          <KeyboardProvider>
            <OnboardingAwaitingNavigator
              onReady={async () => {
                await SplashScreen.hideAsync()
                return true
              }}
            >
              {/* <Slot /> */}
              <Stack
                screenOptions={{
                  headerShown: false,
                }}
              ></Stack>
            </OnboardingAwaitingNavigator>
          </KeyboardProvider>
        </RootProvider>
      </ThemeProvider>
    </BricksTheme>
  )
}

export default App
