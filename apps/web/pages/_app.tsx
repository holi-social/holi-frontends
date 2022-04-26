import { ApolloProvider } from '@apollo/client'
import type { AppProps } from 'next/app'
// Fixes issue with missing requestAnimationFrame used by react-native-reanimated
import 'raf/polyfill'
import React from 'react'

import client from '@holi/api/graphql/client'
import { AuthContextProvider } from '@holi/core/auth/AuthProvider'
import { NavigationContextProvider } from '@holi/ui/components/navigation/context'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import Layout from '@holi/web/layout/layout'
import '@holi/web/styles/globals.scss'

const MyApp: React.VoidFunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultHoliTheme}>
        <AuthContextProvider>
          <NavigationContextProvider>
            <Layout>
              <Component {...pageProps} />
            </Layout>
          </NavigationContextProvider>
        </AuthContextProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default MyApp
