import { ApolloProvider } from '@apollo/client'
import { useSyncLanguage } from 'ni18n'
import type { PropsWithChildren } from 'react'
import React from 'react'

import ChatProvider from '@holi/chat/src/components/ChatProvider'
import ChatSessionInitializer from '@holi/chat/src/components/ChatSessionInitializer'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import LoginModalProvider from '@holi/core/providers/LoginModalProvider'
import PortalProvider from '@holi/core/providers/PortalProvider'
import TrackingInitializer from '@holi/core/tracking/TrackingInitializer'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import { useApolloSSRClient } from '@holi/web/helpers/useApolloSSRClient'
import TrackingProvider from '@holi/web/providers/TrackingProvider'
import { NextJSPageProps } from '@holi/web/types'

interface RootProviderProps {
  pageProps: NextJSPageProps
}

const SSRRootProvider = ({ children, pageProps }: PropsWithChildren<RootProviderProps>) => {
  const apolloWebClient = useApolloSSRClient(pageProps)

  useSyncLanguage(pageProps.locale)

  return (
    <ThemeProvider theme={defaultHoliTheme}>
      <ErrorBoundary>
        <ApolloProvider client={apolloWebClient}>
          <TrackingInitializer />
          <PortalProvider>
            <ToastProvider>
              <LoginModalProvider>
                <ChatSessionInitializer>
                  <ChatProvider>{children}</ChatProvider>
                </ChatSessionInitializer>
              </LoginModalProvider>
            </ToastProvider>
          </PortalProvider>
        </ApolloProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default SSRRootProvider
