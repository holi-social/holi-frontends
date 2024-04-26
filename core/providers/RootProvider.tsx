import { ApolloProvider } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import type { PropsWithChildren } from 'react'
import React, { Suspense } from 'react'
import { Platform, StyleSheet } from 'react-native'

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
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import TrackingProvider from '@holi/web/providers/TrackingProvider'

const client = initializeClientSideApolloClient()

const RootProvider = ({ children }: PropsWithChildren<unknown>) => {
  return (
    // Necessary for loading e.g. translations on mobile.
    // TODO: replace with proper loading indicator
    <Suspense
      fallback={
        <SafeArea style={styles.loadingContainer}>
          <HoliText style={{ textAlign: 'center' }}>Loading...</HoliText>
        </SafeArea>
      }
    >
      <ErrorBoundary>
        <ApolloProvider client={client}>
          <TrackingProvider>
            <TrackingInitializer>
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
            </TrackingInitializer>
          </TrackingProvider>
        </ApolloProvider>
      </ErrorBoundary>
    </Suspense>
  )
}

export default withProfiler(RootProvider, { name: 'RootProvider' })

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
