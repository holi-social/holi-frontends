import React from 'react'
import type { AppProps } from 'next/app'
// Fixes issue with missing requestAnimationFrame used by react-native-reanimated
import 'raf/polyfill'
import { ApolloProvider } from '@apollo/client'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import client from '@holi/api/graphql/client'
import { NavigationContextProvider } from '@holi/ui/components/navigation/useRouting/context'
import Layout from '@holi/web/layout/layout'

import '@holi/web/styles/globals.scss'

const MyApp: React.VoidFunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <ApolloProvider client={client}>
      <ThemeProvider theme={defaultHoliTheme}>
        <NavigationContextProvider>
          <Layout>
            <Component {...pageProps} />
          </Layout>
        </NavigationContextProvider>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default MyApp
