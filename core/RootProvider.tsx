import type { PropsWithChildren } from 'react'
import React, { Suspense } from 'react'
import { StyleSheet } from 'react-native'

import ApolloProviderWrapper from '@holi/core/ApolloProviderWrapper'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { NavigationContextProvider } from '@holi/core/navigation/hooks/NavigationContextProvider'
import LoginModalProvider from '@holi/core/provider/LoginModalProvider'
import PortalProvider from '@holi/core/provider/PortalProvider'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
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
            <HoliLoader />
          </SafeArea>
        }
      >
        <ErrorBoundary>
          <ApolloProviderWrapper>
            <ToastProvider>
              <PortalProvider>
                <NavigationContextProvider>
                  <LoginModalProvider>{children}</LoginModalProvider>
                </NavigationContextProvider>
              </PortalProvider>
            </ToastProvider>
          </ApolloProviderWrapper>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  )
}

export default RootProvider
