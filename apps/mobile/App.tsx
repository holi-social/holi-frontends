import { ApolloProvider } from '@apollo/client'
import React from 'react'

import client from '@holi/api/graphql/client'
import { AuthContextProvider } from '@holi/core/auth/AuthProvider'
import { UserContextProvider } from '@holi/core/user/UserContextProvider'
import { NavigationProvider } from '@holi/mobile/navigation/navigationProvider'
import { NavigationContextProvider } from '@holi/ui/components/navigation/context'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'

import { RootNavigator } from './navigation/rootNavigator'

const App: React.VoidFunctionComponent = () => {
  // TODO(SF) shared provider wrapper component?
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultHoliTheme}>
        <AuthContextProvider>
          <UserContextProvider>
            <NavigationContextProvider>
              <NavigationProvider>
                <RootNavigator />
              </NavigationProvider>
            </NavigationContextProvider>
          </UserContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default App
