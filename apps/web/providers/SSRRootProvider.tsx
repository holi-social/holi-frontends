import { ApolloProvider, getApolloContext } from '@apollo/client'
import type { PropsWithChildren } from 'react'
import React, { useContext } from 'react'

import ChatProvider from '@holi/chat/src/components/ChatProvider'
import ChatSessionInitializer from '@holi/chat/src/components/ChatSessionInitializer'
import FeatureTogglesFetcher from '@holi/core/components/FeatureTogglesFetcher'
import SessionExpiryProtection from '@holi/core/components/SessionExpiryProtection'
import TrackingConsentModal from '@holi/core/components/TrackingConsentModal'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import LoginModalProvider from '@holi/core/providers/LoginModalProvider'
import PortalProvider from '@holi/core/providers/PortalProvider'
import TrackingInitializer from '@holi/core/tracking/TrackingInitializer'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import { useApolloSSRClient } from '@holi/web/helpers/useApolloSSRClient'
import { NextJSPageProps } from '@holi/web/types'

interface RootProviderProps {
  pageProps: NextJSPageProps
}

const SSRRootProvider = ({ children, pageProps }: PropsWithChildren<RootProviderProps>) => {
  // Apollo context is only available on the server side: client side will create new client from page props
  const apolloSsrClient = useApolloSSRClient(pageProps)
  const apolloContext = useContext(getApolloContext())
  const apolloWebClient = apolloContext.client ?? apolloSsrClient

  return (
    <ThemeProvider theme={defaultHoliTheme}>
      <ErrorBoundary>
        <ApolloProvider client={apolloWebClient}>
          <TrackingInitializer />
          <ToastProvider>
            <PortalProvider>
              <SessionExpiryProtection>
                <FeatureTogglesFetcher />
                <LoginModalProvider>
                  <ChatSessionInitializer>
                    <ChatProvider>{children}</ChatProvider>
                  </ChatSessionInitializer>
                </LoginModalProvider>
              </SessionExpiryProtection>
            </PortalProvider>
          </ToastProvider>

          <TrackingConsentModal />
        </ApolloProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default SSRRootProvider
