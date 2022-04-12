import React from 'react'
import { ApolloProvider } from '@apollo/client'

import client from '@holi/api/graphql/client'
import { NavigationProvider } from '@holi/core/navigation'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import { NavigationContextProvider } from '@holi/ui/components/navigation/useRouting/context'
import { AuthContextProvider } from '@holi/core/auth/AuthProvider'

export const Provider: React.VoidFunctionComponent<{ children: React.ReactElement }> = ({ children }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={defaultHoliTheme}>
      <NavigationContextProvider>
        <AuthContextProvider>
          <NavigationProvider>{children}</NavigationProvider>
        </AuthContextProvider>
      </NavigationContextProvider>
    </ThemeProvider>
  </ApolloProvider>
)
