import '../styles/globals.scss'
import React from 'react'
import Layout from '../components/Layout/layout'
import type { AppProps } from 'next/app'
import { Provider } from 'shared/provider'
import { NavigationProvider } from 'shared/provider/navigation'

const MyApp: React.VoidFunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider>
      <NavigationProvider>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </NavigationProvider>
    </Provider>
  )
}

export default MyApp
