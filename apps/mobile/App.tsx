import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useState } from 'react'

import RootProvider from '@holi/core/RootProvider'
import { initI18n } from '@holi/core/i18n'
import NavigationProvider from '@holi/mobile/navigation/NavigationProvider'
import RootNavigator from '@holi/mobile/navigation/RootNavigator'

const App: React.VoidFunctionComponent = () => {
  const [isReady, setIsReady] = useState(false)

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
    <RootProvider>
      <NavigationProvider>
        <RootNavigator />
      </NavigationProvider>
    </RootProvider>
  )
}

export default App
