import { ApolloClient, ApolloProvider } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import type { PropsWithChildren } from 'react'
import React from 'react'
import { Platform } from 'react-native'

import ChatProvider from '@holi/chat/src/components/ChatProvider'
import ChatSessionInitializer from '@holi/chat/src/components/ChatSessionInitializer'
import SessionExpiryProtection from '@holi/core/components/SessionExpiryProtection'
import TrackingConsentModal from '@holi/core/components/TrackingConsentModal'
import UpdateAppModal from '@holi/core/components/UpdateAppModal'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import FeatureFlagsFetcher from '@holi/core/featureFlags/components/FeatureFlagsFetcher'
import LoginModalProvider from '@holi/core/providers/LoginModalProvider'
import PortalProvider from '@holi/core/providers/PortalProvider'
import DeviceRegistration from '@holi/core/screens/notifications/components/DeviceRegistration'
import PosthogProvider, { PosthogProviderProps } from '@holi/core/tracking/PosthogProvider'
import TrackingInitializer from '@holi/core/tracking/TrackingInitializer'
import { SafeAreaProvider } from '@holi/ui/components/atoms/SafeAreaProvider'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'

interface RootProviderProps {
  apolloClient: ApolloClient<object>
  posthogBootstrapState?: PosthogProviderProps['bootstrapState']
}

const RootProvider = ({ apolloClient, posthogBootstrapState, children }: PropsWithChildren<RootProviderProps>) => {
  const isWeb = Platform.OS === 'web'
  const isMobile = !isWeb
  return (
    <ErrorBoundary showErrorMsg={isWeb} allowReload={isWeb}>
      <PosthogProvider bootstrapState={posthogBootstrapState}>
        <SafeAreaProvider>
          <ApolloProvider client={apolloClient}>
            <TrackingInitializer />
            <ToastProvider>
              <PortalProvider>
                <SessionExpiryProtection>
                  <FeatureFlagsFetcher />
                  {isMobile ? <DeviceRegistration /> : null}
                  {isMobile ? <UpdateAppModal /> : null}
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
        </SafeAreaProvider>
      </PosthogProvider>
    </ErrorBoundary>
  )
}

export default withProfiler(RootProvider, { name: 'RootProvider' })
