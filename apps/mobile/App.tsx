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
        ['Circular Std']: require('./assets/fonts/circular-std/circular-std-medium-500.ttf'),
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
