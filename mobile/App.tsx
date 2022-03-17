import React from 'react'

import { Provider } from 'shared/provider'
import { NativeNavigation } from 'shared/navigation/native'

const App: React.VoidFunctionComponent = () => {
  return (
    <Provider>
      <NativeNavigation />
    </Provider>
  )
}

export default App
