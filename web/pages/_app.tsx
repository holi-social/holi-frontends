import '../styles/globals.scss'
import React from 'react'
import Layout from '../components/Layout/layout'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from 'shared/graphql/client'
import { ThemeProvider } from 'shared/styles/theme'

const MyApp: React.VoidFunctionComponent<AppProps> = ({ Component, pageProps }) => {
  if (!global.requestAnimationFrame) {
    global.requestAnimationFrame = (callback: FrameRequestCallback) => 0
  }

  return (
    <ApolloProvider client={client}>
      <ThemeProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </ThemeProvider>
    </ApolloProvider>
  )
}

export default MyApp
