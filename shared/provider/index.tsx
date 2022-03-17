import React from 'react'
import { ApolloProvider } from '@apollo/client'

import defaultHoliTheme, { ThemeProvider } from 'shared/styles/theme'
import client from 'shared/graphql/client'
import { NavigationProvider } from './navigation'

export const Provider: React.VoidFunctionComponent<{ children: React.ReactElement }> = ({ children }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={defaultHoliTheme}>
      <NavigationProvider>{children}</NavigationProvider>
    </ThemeProvider>
  </ApolloProvider>
)
