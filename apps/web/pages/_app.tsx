import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { appWithI18Next } from 'ni18n'
import pino from 'pino'
// Fixes issue with missing requestAnimationFrame used by react-native-reanimated
import 'raf/polyfill'
import React, { type ReactElement, type ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { initializeBricks } from 'holi-bricks/config'
import { isProduction } from '@holi/core/helpers/environment'
import { initAuth } from '@holi/core/auth/helpers/init'
import { setLoginStateLoggedOut } from '@holi/core/auth/loginState'
import HoliHead from '@holi/core/components/HoliHead'
import { SeoTitle } from '@holi/core/components/SeoTitle'
import { logError } from '@holi/core/errors/helpers'
import { isSSR } from '@holi/core/helpers/isSSR'
import { markDeviceTokenAsInitialized } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'
import NavigationLayoutRoot from '@holi/web/layout/NavigationLayoutRoot'
import WebRootProvider from '@holi/web/providers/WebRootProvider'
import '@holi/web/styles/globals.css'
import { HoliPageProps, type NextJSPageProps } from '@holi/web/types'
import { useRouter } from 'next/router'
import { metaSdk } from '@holi/core/tracking/FacebookSdkCrossPlatform'

export interface AppPropsWithLayout extends AppProps {
  Component: NextPageWithLayout
  pageProps: NextJSPageProps
}

export type NextPageWithLayout = NextPage<NextJSPageProps> & {
  getLayout?: (page: ReactElement) => ReactNode
}

pino().debug('Avoid treeshaking of externally included logging framework by next build')
initializeBricks({ isProduction })

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  const { t } = useTranslation()
  const holiPageProps = new HoliPageProps(pageProps)
  const router = useRouter()

  // Synchronize initial login state between server and client
  if (holiPageProps.user?.isLoggedOut && !isSSR) {
    setLoginStateLoggedOut()
  }

  useEffect(() => {
    const handleRouteChange = () => {
      metaSdk.trackEvent('PageView')
    }

    router.events.on('routeChangeComplete', handleRouteChange)
    return () => router.events.off('routeChangeComplete', handleRouteChange)
  }, [router.events])

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
  const getLayout = Component.getLayout ?? ((page) => <NavigationLayoutRoot>{page}</NavigationLayoutRoot>)

  return (
    <WebRootProvider pageProps={holiPageProps}>
      <HoliHead
        title={t('metatags.default.title')}
        description={t('metatags.default.description')}
        ogTitle={t('metatags.default.og.title')}
        ogDescription={t('metatags.default.og.description')}
        ogImage="https://framerusercontent.com/images/fJSZ0w0k135AntP0ZxMNfyZSSwE.jpg"
        origin={holiPageProps.origin}
        {...holiPageProps.customProps}
      />
      <SeoTitle seoTitle={holiPageProps.customProps?.seoTitle} />
      {getLayout(<Component {...pageProps} />)}
    </WebRootProvider>
  )
}

export default appWithI18Next(MyApp, ni18nConfig)
