import { NextPage } from 'next'
import type { AppProps } from 'next/app'
// Fixes issue with missing requestAnimationFrame used by react-native-reanimated
import 'raf/polyfill'
import React, { ReactElement, ReactNode } from 'react'

import { Provider } from '@holi/core/provider'
import DefaultLayout from '@holi/web/layout/DefaultLayout'
import '@holi/web/styles/globals.scss'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
}

const MyApp: React.VoidFunctionComponent<AppProps> = ({ Component, pageProps }: AppPropsWithLayout) => {
  // TODO: alternatively to this approach, we could choose <AppLayout> for every route with '/apps/' prefix

  // taken from https://nextjs.org/docs/basic-features/layouts#with-typescript
  // Use the layout defined at the page level, if available
  const getLayout = Component.getLayout ?? ((page) => <DefaultLayout>{page}</DefaultLayout>)
  return <Provider>{getLayout(<Component {...pageProps} />)}</Provider>
}

export default MyApp
