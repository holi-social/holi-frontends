import React from 'react'
import { Provider } from 'shared/provider'
import { NativeNavigation } from './navigation'

const App: React.VoidFunctionComponent = () => {
  return (
    <Provider>
      <NativeNavigation />
    </Provider>
  )
}

export default App
