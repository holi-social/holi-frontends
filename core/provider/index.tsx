import React from 'react'
import { ApolloProvider } from '@apollo/client'
import client from '@holi/api/graphql/client'
import { NavigationContextProvider } from '@holi/ui/components/navigation/useRouting/context'
import { NavigationProvider } from '@holi/core/navigation'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'

export const Provider: React.VoidFunctionComponent<{ children: React.ReactElement }> = ({ children }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={defaultHoliTheme}>
      <NavigationContextProvider>
        <NavigationProvider>{children}</NavigationProvider>
      </NavigationContextProvider>
    </ThemeProvider>
  </ApolloProvider>
)
