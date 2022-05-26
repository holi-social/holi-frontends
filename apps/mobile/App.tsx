import React from 'react'

import { Provider } from '@holi/core/provider'
import { NavigationProvider } from '@holi/mobile/navigation/navigationProvider'

import { RootTabsNavigator } from './navigation/rootTabsNavigator'

const App: React.VoidFunctionComponent = () => {
  return (
    <Provider>
      <NavigationProvider>
        <RootTabsNavigator />
      </NavigationProvider>
    </Provider>
  )
}

export default App
