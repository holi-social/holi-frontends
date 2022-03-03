import '../styles/globals.scss'
import Layout from '../components/Layout/layout'
import type { AppProps } from 'next/app'
import { ApolloProvider } from '@apollo/client'
import client from 'shared/graphql/client'
import { ThemeProvider } from 'shared/styles/theme'

function MyApp({ Component, pageProps }: AppProps) {
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
