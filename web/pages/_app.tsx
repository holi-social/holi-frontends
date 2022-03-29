import React from 'react'
import type { AppProps } from 'next/app'
// Fixes issue with missing requestAnimationFrame used by react-native-reanimated
import 'raf/polyfill'

// Apollo, Theme, NavigationContext, Navigation(not used in web)
import { Provider } from 'shared/provider'
import Layout from 'web/Layout/layout'

import 'web/styles/globals.scss'

const MyApp: React.VoidFunctionComponent<AppProps> = ({ Component, pageProps }) => {
  return (
    <Provider>
      <Layout>
        <Component {...pageProps} />
      </Layout>
    </Provider>
  )
}

export default MyApp
