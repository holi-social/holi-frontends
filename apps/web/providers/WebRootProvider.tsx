import { getApolloContext } from '@apollo/client'
import type { PropsWithChildren } from 'react'
import React, { useContext } from 'react'

import RootProvider from '@holi/core/providers/RootProvider'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import { useApolloWebClient } from '@holi/web/helpers/useApolloWebClient'
import type { HoliPageProps } from '@holi/web/types'

interface RootProviderProps {
  pageProps: HoliPageProps
}

const WebRootProvider = ({ children, pageProps }: PropsWithChildren<RootProviderProps>) => {
  // Apollo context is only available on the server side: client side will create new client from page props
  const apolloWebClient = useApolloWebClient(pageProps)
  const apolloContext = useContext(getApolloContext())
  const apolloClient = apolloContext.client ?? apolloWebClient

  return (
    <ThemeProvider theme={defaultHoliTheme}>
      <RootProvider apolloClient={apolloClient} posthogBootstrapState={pageProps.posthogBootstrapValues}>
        {children}
      </RootProvider>
    </ThemeProvider>
  )
}

export default WebRootProvider
