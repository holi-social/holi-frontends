import React from 'react'
import { ApolloProvider } from '@apollo/client'

import client from 'shared/graphql/client'
import { NavigationProvider } from 'shared/provider/navigation'
import defaultHoliTheme, { ThemeProvider } from 'shared/styles/theme'
import { NavigationContextProvider } from 'shared/navigation/useRouting/context'

export const Provider: React.VoidFunctionComponent<{ children: React.ReactElement }> = ({ children }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={defaultHoliTheme}>
      <NavigationContextProvider>
        <NavigationProvider>{children}</NavigationProvider>
      </NavigationContextProvider>
    </ThemeProvider>
  </ApolloProvider>
)
