import { ApolloProvider } from '@apollo/client'
import React from 'react'

import client from '@holi/api/graphql/client'
import { NavigationProvider } from '@holi/mobile/navigation/navigationProvider'
import { NavigationContextProvider } from '@holi/ui/components/navigation/context'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'

import { RootNavigator } from './navigation/rootNavigator'

const App: React.VoidFunctionComponent = () => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultHoliTheme}>
        <NavigationContextProvider>
          <NavigationProvider>
            <RootNavigator />
          </NavigationProvider>
        </NavigationContextProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
