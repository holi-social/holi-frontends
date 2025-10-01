import { type ApolloClient, ApolloProvider } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import React, { type PropsWithChildren } from 'react'
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
import PosthogProvider, { type PosthogProviderProps } from '@holi/core/tracking/PosthogProvider'
import TrackingInitializer from '@holi/core/tracking/TrackingInitializer'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import { SnackbarGlobal } from '@holi/core/components/SnackbarGlobal'
import { HoliWebViewGlobalModal } from '@holi/ui/components/organisms/HoliWebViewGlobalModal'
import { GoodDeedsIntroModal } from '@holi/core/screens/onboarding/components/GoodDeedsIntroModal'
import { EarnedBadgesModalProvider } from '@holi-apps/volunteering/components/VolunteeringProgressCard/EarnedBadgesModalProvider'
import FeatureFlagGuard from '@holi/core/featureFlags/components/FeatureFlagGuard'
import { FeatureFlagKey } from '@holi/core/featureFlags/constants'

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
                    <FeatureFlagGuard flag={FeatureFlagKey.GOOD_DEEDS_INTRO_1}>
                      <GoodDeedsIntroModal />
                    </FeatureFlagGuard>
                    {isMobile ? <DeviceRegistration /> : null}
                    {isMobile ? <UpdateAppModal /> : null}
                    {isMobile ? <HoliWebViewGlobalModal /> : null}
                    <SignupModalProvider>
                      <EarnedBadgesModalProvider>
                        <ChatSessionInitializer>
                          <ChatProvider>{children}</ChatProvider>
                        </ChatSessionInitializer>
                      </EarnedBadgesModalProvider>
                    </SignupModalProvider>
                  </RefreshContextProvider>
                </SessionExpiryProtection>
              </PortalProvider>
            </ToastProvider>

            <SnackbarGlobal />
            <TrackingConsentModal />
          </ApolloProvider>
        </SafeAreaProvider>
      </PosthogProvider>
    </ErrorBoundary>
  )
}

export default withProfiler(RootProvider, { name: 'RootProvider' })
