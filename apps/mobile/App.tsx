import { useFonts } from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import RootProvider from '@holi/core/RootProvider'
import { initAuth } from '@holi/core/auth/helpers/init'
import { logError } from '@holi/core/errors/helpers'
import { initNotifications } from '@holi/core/helpers/notifications'
import { initI18n } from '@holi/core/i18n'
import { config } from '@holi/mobile/config'
import NavigationProvider from '@holi/mobile/navigation/NavigationProvider'
import RootNavigator from '@holi/mobile/navigation/RootNavigator'

SplashScreen.preventAutoHideAsync()

if (__DEV__) {
  console.debug('Starting app with config', config)
}

const App = () => {
  const [isReady, setIsReady] = useState(false)
  const [initDone, setInitDone] = useState(false)

  if (__DEV__) {
    console.debug('App starting with config', JSON.stringify(config, null, 2))
  }

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

  const fonts = {
    ['Circular Std Book']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-Book.otf'),
    ['Circular Std Book Italic']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-BookItalic.otf'),
    ['Circular Std Medium']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-Medium.otf'),
    ['Circular Std Medium Italic']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-MediumItalic.otf'),
  }

  const [fontsLoaded] = useFonts(fonts)

  const init = async () => {
    try {
      await Promise.all([initI18n(), initAuth(), initNotifications()])
    } catch (error) {
      logError(error, '[App.tsx]: Error initializing the app')
    } finally {
      setInitDone(true)
    }
  }

  useEffect(() => {
    init()
  })

  useEffect(() => {
    if (fontsLoaded && initDone) {
      setIsReady(true)
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, initDone])

  if (!isReady) return null

  return (
    <>
      <StatusBar style="dark" />
      <NavigationProvider>
        <RootProvider>
          <RootNavigator />
        </RootProvider>
      </NavigationProvider>
    </>
  )
}

export default App
