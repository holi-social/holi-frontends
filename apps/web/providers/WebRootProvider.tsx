import { getApolloContext } from '@apollo/client'
import type { PropsWithChildren } from 'react'
import React, { useContext } from 'react'

import RootProvider from '@holi/core/providers/RootProvider'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import { useApolloSSRClient } from '@holi/web/helpers/useApolloSSRClient'
import { type NextJSPageProps, POSTHOG_BOOTSTRAP_PROP_NAME } from '@holi/web/types'

interface RootProviderProps {
  pageProps: NextJSPageProps
}

const WebRootProvider = ({ children, pageProps }: PropsWithChildren<RootProviderProps>) => {
  // Apollo context is only available on the server side: client side will create new client from page props
  const apolloSsrClient = useApolloSSRClient(pageProps)
  const apolloContext = useContext(getApolloContext())
  const apolloClient = apolloContext.client ?? apolloSsrClient
  const posthogBootstrapState = pageProps[POSTHOG_BOOTSTRAP_PROP_NAME]

  return (
    <ThemeProvider theme={defaultHoliTheme}>
      <RootProvider apolloClient={apolloClient} posthogBootstrapState={posthogBootstrapState}>
        {children}
      </RootProvider>
    </ThemeProvider>
  )
}

export default WebRootProvider
