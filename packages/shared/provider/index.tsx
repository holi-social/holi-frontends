import React from 'react'
import { ApolloProvider } from '@apollo/client'

import client from '@holi/shared/graphql/client'
import { NavigationProvider } from '@holi/shared/provider/navigation'
import defaultHoliTheme, { ThemeProvider } from '@holi/shared/styles/theme'
import { NavigationContextProvider } from '@holi/shared/components/navigation/useRouting/context'

export const Provider: React.VoidFunctionComponent<{ children: React.ReactElement }> = ({ children }) => (
  <ApolloProvider client={client}>
    <ThemeProvider theme={defaultHoliTheme}>
      <NavigationContextProvider>
        <NavigationProvider>{children}</NavigationProvider>
      </NavigationContextProvider>
    </ThemeProvider>
  </ApolloProvider>
)
