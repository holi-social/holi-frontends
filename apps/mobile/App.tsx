import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import RootProvider from '@holi/core/RootProvider'
import { initAuth } from '@holi/core/auth/helpers/init'
import { logError } from '@holi/core/errors/helpers'
import { initI18n } from '@holi/core/i18n'
import NavigationProvider from '@holi/mobile/navigation/NavigationProvider'
import RootNavigator from '@holi/mobile/navigation/RootNavigator'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const App: ({ routingInstrumentation }: { routingInstrumentation: any }) => React.VoidFunctionComponent =
  // eslint-disable-next-line react/display-name
  (routingInstrumentation) => () => {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const [isReady, setIsReady] = useState(false)

    SplashScreen.preventAutoHideAsync()

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

    // TODO (mobile): refactor to util function
    const init = async () => {
      try {
        await Promise.all([
          Font.loadAsync({
            ['Circular Std Book']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-Book.otf'),
            ['Circular Std Book Italic']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-BookItalic.otf'),
            ['Circular Std Medium']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-Medium.otf'),
            ['Circular Std Medium Italic']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-MediumItalic.otf'),
          }),
          initI18n(),
          initAuth(),
        ])
      } catch (error) {
        logError(error, '[App.tsx]: Error initializing the app')
      } finally {
        setIsReady(true)
        await SplashScreen.hideAsync()
      }
    }

    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      init()
    }, [])

    if (!isReady) return null

    return (
      <>
        <StatusBar style="dark" />
        <NavigationProvider routingInstrumentation={routingInstrumentation}>
          <RootProvider>
            <RootNavigator />
          </RootProvider>
        </NavigationProvider>
      </>
    )
  }

export default App
