import React from 'react'
import { Provider } from '@holi/core/provider'
import { RootNavigator } from './navigation/rootNavigator'

const App: React.VoidFunctionComponent = () => {
  return (
    <Provider>
      <RootNavigator />
    </Provider>
  )
}

export default App
