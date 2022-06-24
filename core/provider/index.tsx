import { ApolloProvider } from '@apollo/client'
import React from 'react'

import client from '@holi/api/graphql/client'
import { AuthContextProvider } from '@holi/core/auth/AuthProvider'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { NavigationContextProvider } from '@holi/core/navigation/context'
import { UserContextProvider } from '@holi/core/user/UserContextProvider'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'

export const Provider: React.VoidFunctionComponent<{ children: React.ReactElement }> = ({ children }) => (
  <ThemeProvider theme={defaultHoliTheme}>
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <AuthContextProvider>
          <UserContextProvider>
            <NavigationContextProvider>{children}</NavigationContextProvider>
          </UserContextProvider>
        </AuthContextProvider>
      </ApolloProvider>
    </ErrorBoundary>
  </ThemeProvider>
)
