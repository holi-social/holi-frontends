import React from 'react'
import { Provider } from 'shared/provider'
import { RootNavigator } from './navigation/rootNavigator'

const App: React.VoidFunctionComponent = () => {
  return (
    <Provider>
      <RootNavigator />
    </Provider>
  )
}

export default App
