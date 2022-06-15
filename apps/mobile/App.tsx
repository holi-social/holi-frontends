import * as Font from 'expo-font'
import * as SplashScreen from 'expo-splash-screen'
import React, { useEffect, useState } from 'react'

import { Provider } from '@holi/core/provider'
import { NavigationProvider } from '@holi/mobile/navigation/navigationProvider'

import { RootNavigator } from './navigation/rootNavigator'

const App: React.VoidFunctionComponent = () => {
  const [isReady, setIsReady] = useState(false)

  // TODO (mobile): refactor to util function
  const init = async () => {
    try {
      await Font.loadAsync({
        ['Circular Std Book']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-Book.otf'),
        ['Circular Std Book Italic']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-BookItalic.otf'),
        ['Circular Std Medium']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-Medium.otf'),
        ['Circular Std Medium Italic']: require('@holi/ui/assets/fonts/CircularStd/CircularStd-MediumItalic.otf'),
      })
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
    <Provider>
      <NavigationProvider>
        <RootNavigator />
      </NavigationProvider>
    </Provider>
  )
}

export default App
