import { ApolloProvider } from '@apollo/client'
import React from 'react'

import client from '@holi/api/graphql/client'
import { AuthContextProvider } from '@holi/core/auth/AuthProvider'
import { NavigationContextProvider } from '@holi/core/navigation/provider/context'
import { UserContextProvider } from '@holi/core/user/UserContextProvider'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'

export const Provider: React.VoidFunctionComponent<{ children: React.ReactElement }> = ({ children }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={defaultHoliTheme}>
      <AuthContextProvider>
        <UserContextProvider>
          <NavigationContextProvider>{children}</NavigationContextProvider>
        </UserContextProvider>
      </AuthContextProvider>
    </ThemeProvider>
  </ApolloProvider>
)
