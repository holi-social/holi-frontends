import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { useRouter } from 'next/router'
import { appWithI18Next } from 'ni18n'
import pino from 'pino'
import posthog from 'posthog-js'
import { PostHogProvider } from 'posthog-js/react'
import { usePostHog } from 'posthog-js/react'
// Fixes issue with missing requestAnimationFrame used by react-native-reanimated
import 'raf/polyfill'
import React, { ReactElement, ReactNode, useEffect } from 'react'

import { initAuth } from '@holi/core/auth/helpers/init'
import { logError } from '@holi/core/errors/helpers'
import { markDeviceTokenAsInitialized } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { featureFlag } from '@holi/web/environment'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'
import NavigationLayoutRoot from '@holi/web/layout/NavigationLayoutRoot'
import ClientRootProvider from '@holi/web/providers/ClientRootProvider'
import SSRRootProvider from '@holi/web/providers/SSRRootProvider'
import '@holi/web/styles/globals.css'
import { NextJSPageProps } from '@holi/web/types'

export interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout
  pageProps: NextJSPageProps
}

export type NextPageWithLayout = NextPage<NextJSPageProps> & {
  getLayout?: (page: ReactElement) => ReactNode
}

pino().debug('Avoid treeshaking of externally included logging framework by next build')

// Check that PostHog is client-side (used to handle Next.js SSR)
if (typeof window !== 'undefined') {
  posthog.init(process.env.NEXT_PUBLIC_POSTHOG_KEY || '', {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_API_HOST || '',
    ui_host: process.env.NEXT_PUBLIC_POSTHOG_UI_HOST,
    // Enable debug mode in development
    loaded: (posthog) => {
      if (process.env.NODE_ENV === 'development') posthog.debug()
    },
  })
}

const MyApp: React.VoidFunctionComponent<AppProps> = ({ Component, pageProps }: AppPropsWithLayout) => {
  // defaultProps can be used to pass page specific props to the DefaultLayout component
  const { defaultProps = {} } = Component
  const router = useRouter()
  const posthog = usePostHog()

  useEffect(() => {
    // Init authentication
    initAuth((userId) => posthog.identify(userId)).catch((error) =>
      logError(error, 'Error initializing authentication', {
        location: '_app.initAuth',
      })
    )
    // Currently we do not support push notifications for web
    markDeviceTokenAsInitialized()
  }, [posthog])

  useEffect(() => {
    // Track page views
    const handleRouteChange = () => posthog?.capture('$pageview')
    router.events.on('routeChangeComplete', handleRouteChange)

    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events, posthog])

  // TODO: alternatively to this approach, we could choose <AppLayout> for every route with '/apps/' prefix
  // taken from https://nextjs.org/docs/basic-features/layouts#with-typescript
  // Use the layout defined at the page level, if available
  const getLayout =
    Component.getLayout ?? ((page) => <NavigationLayoutRoot {...defaultProps}>{page}</NavigationLayoutRoot>)

  return (
    <PostHogProvider client={posthog}>
      {featureFlag.enableSSR ? (
        <SSRRootProvider pageProps={pageProps}>{getLayout(<Component {...pageProps} />)}</SSRRootProvider>
      ) : (
        <ClientRootProvider>{getLayout(<Component {...pageProps} />)}</ClientRootProvider>
      )}
    </PostHogProvider>
  )
}

export default featureFlag.enableSSR ? appWithI18Next(MyApp, ni18nConfig) : MyApp
