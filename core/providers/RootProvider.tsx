import { type ApolloClient, ApolloProvider } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import type { PropsWithChildren } from 'react'
import React from 'react'
import { Platform } from 'react-native'
import { SafeAreaProvider, initialWindowMetrics } from 'react-native-safe-area-context'

import ChatProvider from '@holi/chat/src/components/ChatProvider'
import ChatSessionInitializer from '@holi/chat/src/components/ChatSessionInitializer'
import SessionExpiryProtection from '@holi/core/components/SessionExpiryProtection'
import TrackingConsentModal from '@holi/core/components/TrackingConsentModal'
import UpdateAppModal from '@holi/core/components/UpdateAppModal'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import FeatureFlagsFetcher from '@holi/core/featureFlags/components/FeatureFlagsFetcher'
import PortalProvider from '@holi/core/providers/PortalProvider'
import SignupModalProvider from '@holi/core/providers/SignupModalProvider'
import { RefreshContextProvider } from '@holi/core/refreshing/providers/RefreshContextProvider'
import DeviceRegistration from '@holi/core/screens/notifications/components/DeviceRegistration'
import OnboardingInitializer from '@holi/core/screens/onboarding/OnboardingInitializer'
import PosthogProvider, { type PosthogProviderProps } from '@holi/core/tracking/PosthogProvider'
import TrackingInitializer from '@holi/core/tracking/TrackingInitializer'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import { RegistrationFinishModal } from '@holi/core/auth/components/RegistrationFinishModal'

const initialWindowMetricsForWeb = {
  frame: { x: 0, y: 0, width: 0, height: 0 },
  insets: { top: 0, left: 0, right: 0, bottom: 0 },
}

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
        <SafeAreaProvider initialMetrics={isWeb ? initialWindowMetricsForWeb : initialWindowMetrics}>
          <ApolloProvider client={apolloClient}>
            <TrackingInitializer />
            <ToastProvider>
              <PortalProvider>
                <SessionExpiryProtection>
                  <RefreshContextProvider>
                    <FeatureFlagsFetcher />
                    <OnboardingInitializer />
                    {isMobile ? <DeviceRegistration /> : null}
                    {isMobile ? <UpdateAppModal /> : null}
                    <SignupModalProvider>
                      <ChatSessionInitializer>
                        <ChatProvider>{children}</ChatProvider>
                      </ChatSessionInitializer>
                    </SignupModalProvider>
                  </RefreshContextProvider>
                </SessionExpiryProtection>
              </PortalProvider>
            </ToastProvider>

            <TrackingConsentModal />
            <RegistrationFinishModal />
          </ApolloProvider>
        </SafeAreaProvider>
      </PosthogProvider>
    </ErrorBoundary>
  )
}

export default withProfiler(RootProvider, { name: 'RootProvider' })
