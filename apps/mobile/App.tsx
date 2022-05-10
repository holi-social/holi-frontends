import React from 'react'

import { Provider } from '@holi/core/provider'
import { NavigationProvider } from '@holi/mobile/navigation/navigationProvider'

import { RootNavigator } from './navigation/rootNavigator'

const App: React.VoidFunctionComponent = () => {
  return (
    <Provider>
      <NavigationProvider>
        <RootNavigator />
      </NavigationProvider>
    </Provider>
  )
}

export default App
