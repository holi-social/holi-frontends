import React from 'react'
import { ApolloProvider } from '@apollo/client'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import client from '@holi/api/graphql/client'
import { NavigationContextProvider } from '@holi/ui/components/navigation/useRouting/context'
import { NavigationProvider } from '@holi/mobile/navigation/navigationProvider'
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
