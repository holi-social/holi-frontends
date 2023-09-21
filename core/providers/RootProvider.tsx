import { ApolloProvider } from '@apollo/client'
import { withProfiler } from '@sentry/react'
import type { PropsWithChildren } from 'react'
import React, { Suspense } from 'react'
import { Platform, StyleSheet } from 'react-native'

import client from '@holi/api/graphql/client'
import ChatStoreInitializer from '@holi/chat/src/components/ChatStoreInitializer'
import FeatureTogglesFetcher from '@holi/core/components/FeatureTogglesFetcher'
import SessionExpiryProtection from '@holi/core/components/SessionExpiryProtection'
import UpdateAppModal from '@holi/core/components/UpdateAppModal'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import LoginModalProvider from '@holi/core/providers/LoginModalProvider'
import PortalProvider from '@holi/core/providers/PortalProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'

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

const RootProvider = ({ children }: PropsWithChildren<unknown>) => {
  return (
    <ThemeProvider theme={defaultHoliTheme}>
      {/* Necessary for loading e.g. translations on mobile */}
      {/* TODO: replace with proper loading indicator */}
      <Suspense
        fallback={
          <SafeArea style={styles.loadingContainer}>
            <HoliText style={{ textAlign: 'center' }}>Loading...</HoliText>
          </SafeArea>
        }
      >
        <ErrorBoundary>
          <ApolloProvider client={client}>
            <ToastProvider>
              <PortalProvider>
                <SessionExpiryProtection>
                  <FeatureTogglesFetcher />
                  {Platform.OS !== 'web' ? <UpdateAppModal /> : null}
                  <LoginModalProvider>
                    <ChatStoreInitializer>{children}</ChatStoreInitializer>
                  </LoginModalProvider>
                </SessionExpiryProtection>
              </PortalProvider>
            </ToastProvider>
          </ApolloProvider>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  )
}

export default withProfiler(RootProvider, { name: 'RootProvider' })
