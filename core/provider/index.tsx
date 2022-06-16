import { ApolloProvider } from '@apollo/client'
import React from 'react'

import client from '@holi/api/graphql/client'
import { AuthContextProvider } from '@holi/core/auth/AuthProvider'
import { UserContextProvider } from '@holi/core/user/UserContextProvider'
import { ErrorBoundary } from '@holi/ui/components/errors/ErrorBoundary'
import { NavigationContextProvider } from '@holi/ui/components/navigation/context'
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
