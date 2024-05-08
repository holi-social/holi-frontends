import { ApolloProvider } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import type { PropsWithChildren } from 'react'
import React from 'react'
import { Platform } from 'react-native'

import { initializeClientSideApolloClient } from '@holi/api/graphql/client'
import ChatProvider from '@holi/chat/src/components/ChatProvider'
import ChatSessionInitializer from '@holi/chat/src/components/ChatSessionInitializer'
import FeatureTogglesFetcher from '@holi/core/components/FeatureTogglesFetcher'
import SessionExpiryProtection from '@holi/core/components/SessionExpiryProtection'
import UpdateAppModal from '@holi/core/components/UpdateAppModal'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import LoginModalProvider from '@holi/core/providers/LoginModalProvider'
import PortalProvider from '@holi/core/providers/PortalProvider'
import DeviceRegistration from '@holi/core/screens/notifications/components/DeviceRegistration'
import TrackingInitializer from '@holi/core/tracking/TrackingInitializer'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

const client = initializeClientSideApolloClient()

const RootProvider = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <ErrorBoundary>
      <ApolloProvider client={client}>
        <TrackingInitializer />
        <ToastProvider>
          <PortalProvider>
            <SessionExpiryProtection>
              <FeatureTogglesFetcher />
              {Platform.OS !== 'web' ? <DeviceRegistration /> : null}
              {Platform.OS !== 'web' ? <UpdateAppModal /> : null}
              <LoginModalProvider>
                <ChatSessionInitializer>
                  <ChatProvider>{children}</ChatProvider>
                </ChatSessionInitializer>
              </LoginModalProvider>
            </SessionExpiryProtection>
          </PortalProvider>
        </ToastProvider>
      </ApolloProvider>
    </ErrorBoundary>
  )
}

export default withProfiler(RootProvider, { name: 'RootProvider' })
