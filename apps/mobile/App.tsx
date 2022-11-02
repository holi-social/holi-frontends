import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect, useState } from 'react'
import { Platform } from 'react-native'

import RootProvider from '@holi/core/RootProvider'
import { ScrollYProvider } from '@holi/core/helpers'
import { initI18n } from '@holi/core/i18n'
import NavigationProvider from '@holi/mobile/navigation/NavigationProvider'
import RootNavigator from '@holi/mobile/navigation/RootNavigator'

const App: React.VoidFunctionComponent = () => {
  const [isReady, setIsReady] = useState(false)

  // Android requires importing Intl polyfills to use APIs such as RelativeTimeFormat
  if (Platform.OS === 'android') {
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
      ])
    } catch (e) {
      console.warn(e)
    } finally {
      setIsReady(true)
      await SplashScreen.hideAsync()
    }
  }

  useEffect(() => {
    init()
  }, [])

  if (!isReady) return null

  return (
    <>
      <StatusBar style="dark" />
      <RootProvider>
        <NavigationProvider>
          <ScrollYProvider>
            <RootNavigator />
          </ScrollYProvider>
        </NavigationProvider>
      </RootProvider>
    </>
  )
}

export default App
