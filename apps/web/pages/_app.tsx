import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { appWithI18Next } from 'ni18n'
import pino from 'pino'
// Fixes issue with missing requestAnimationFrame used by react-native-reanimated
import 'raf/polyfill'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { initAuth } from '@holi/core/auth/helpers/init'
import HoliHead from '@holi/core/components/HoliHead'
import { SeoTitle } from '@holi/core/components/SeoTitle'
import { logError } from '@holi/core/errors/helpers'
import { markDeviceTokenAsInitialized } from '@holi/core/screens/notifications/helpers/useDeviceToken'
import { ni18nConfig } from '@holi/web/helpers/ni18nConfig'
import NavigationLayoutRoot from '@holi/web/layout/NavigationLayoutRoot'
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

const MyApp = ({ Component, pageProps }: AppPropsWithLayout) => {
  // defaultProps can be used to pass page specific props to the DefaultLayout component
  const { defaultProps = {} } = Component
  const { t } = useTranslation()

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

  const { customProps: { seoTitle, urls } = {}, origin } = pageProps
  return (
    <>
      <HoliHead
        title={t('metatags.default.title')}
        description={t('metatags.default.description')}
        ogTitle={t('metatags.default.og.title')}
        ogDescription={t('metatags.default.og.description')}
        ogImage="https://framerusercontent.com/images/fJSZ0w0k135AntP0ZxMNfyZSSwE.jpg"
        origin={origin}
        urls={urls}
      />
      <SSRRootProvider pageProps={pageProps}>
        <SeoTitle seoTitle={seoTitle} />
        {getLayout(<Component {...pageProps} />)}
      </SSRRootProvider>
    </>
  )
}

export default appWithI18Next(MyApp, ni18nConfig)
