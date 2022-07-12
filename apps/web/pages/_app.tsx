import { NextPage } from 'next'
import type { AppProps } from 'next/app'
// Fixes issue with missing requestAnimationFrame used by react-native-reanimated
import 'raf/polyfill'
import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import { I18nextProvider } from 'react-i18next'
import { StyleSheet } from 'react-native'

import RootProvider from '@holi/core/RootProvider'
import i18n, { initI18n } from '@holi/core/i18n'
import HoliText from '@holi/ui/components/HoliText'
import SafeArea from '@holi/ui/components/SafeArea'
import NavigationLayoutRoot from '@holi/web/layout/NavigationLayoutRoot'
import '@holi/web/styles/globals.scss'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const styles = StyleSheet.create({
  loadingContainer: {
    height: '100%',
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-start',
    position: 'relative',
    marginTop: 100,
  },
})

const MyApp: React.VoidFunctionComponent<AppProps> = ({ Component, pageProps }: AppPropsWithLayout) => {
  const [translationsLoaded, setTranslationsLoaded] = useState(i18n.isInitialized)
  useEffect(() => {
    initI18n().then(() => {
      setTranslationsLoaded(true)
    })
  }, [])

  // TODO: alternatively to this approach, we could choose <AppLayout> for every route with '/apps/' prefix

  // taken from https://nextjs.org/docs/basic-features/layouts#with-typescript
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <NavigationLayoutRoot>{page}</NavigationLayoutRoot>)

  return translationsLoaded ? (
    <I18nextProvider i18n={i18n}>
      <RootProvider>{getLayout(<Component {...pageProps} />)}</RootProvider>
    </I18nextProvider>
  ) : (
    <SafeArea style={styles.loadingContainer}>
      <HoliText styls={{ textAlign: 'center' }}>Loading translations...</HoliText>
    </SafeArea>
  )
}

export default MyApp
