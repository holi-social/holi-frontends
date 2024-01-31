import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { appWithI18Next } from 'ni18n'
import pino from 'pino'
// Fixes issue with missing requestAnimationFrame used by react-native-reanimated
import 'raf/polyfill'
import React, { ReactElement, ReactNode, useEffect } from 'react'

import { initAuth } from '@holi/core/auth/helpers/init'
import { logError } from '@holi/core/errors/helpers'
import { markDeviceTokenAsInitialized } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { featureFlag } from '@holi/web/environment'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'
import type { ApolloStateProps } from '@holi/web/helpers/useApolloSSRClient'
import NavigationLayoutRoot from '@holi/web/layout/NavigationLayoutRoot'
import ClientRootProvider from '@holi/web/providers/ClientRootProvider'
import SSRRootProvider from '@holi/web/providers/SSRRootProvider'
import '@holi/web/styles/globals.scss'
import { NextJSPageProps } from '@holi/web/types'

export interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout
  pageProps: NextJSPageProps
}

export type NextPageWithLayout = NextPage<ApolloStateProps> & {
  getLayout?: (page: ReactElement) => ReactNode
}

pino().debug('Avoid treeshaking of externally included logging framework by next build')

const MyApp: React.VoidFunctionComponent<AppProps> = ({ Component, pageProps }: AppPropsWithLayout) => {
  // defaultProps can be used to pass page specific props to the DefaultLayout component
  const { defaultProps = {} } = Component

  useEffect(() => {
    // Init authentication
    initAuth().catch((error) =>
      logError(error, 'Error initializing authentication', {
        location: '_app.initAuth',
      })
    )
    // Currently we do not support push notifications for web
    markDeviceTokenAsInitialized()
  }, [])

  // TODO: alternatively to this approach, we could choose <AppLayout> for every route with '/apps/' prefix
  // taken from https://nextjs.org/docs/basic-features/layouts#with-typescript
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ?? ((page) => <NavigationLayoutRoot {...defaultProps}>{page}</NavigationLayoutRoot>)

  return featureFlag.enableSSR ? (
    <SSRRootProvider pageProps={pageProps}>{getLayout(<Component {...pageProps} />)}</SSRRootProvider>
  ) : (
    <ClientRootProvider>{getLayout(<Component {...pageProps} />)}</ClientRootProvider>
  )
}

export default appWithI18Next(MyApp, ni18nConfig)
