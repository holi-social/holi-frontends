import { ApolloProvider } from '@apollo/client'
import { useSyncLanguage } from 'ni18n'
import type { PropsWithChildren } from 'react'
import React, { Suspense } from 'react'
import { StyleSheet } from 'react-native'

import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import LoginModalProvider from '@holi/core/providers/LoginModalProvider'
import PortalProvider from '@holi/core/providers/PortalProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'
import { useApolloSSRClient } from '@holi/web/helpers/useApolloSSRClient'
import { NextJSPageProps } from '@holi/web/types'

interface RootProviderProps {
  pageProps: NextJSPageProps
}

const SSRRootProvider = ({ children, pageProps }: PropsWithChildren<RootProviderProps>) => {
  const apolloWebClient = useApolloSSRClient(pageProps)

  useSyncLanguage(pageProps.locale)

  return (
    <ThemeProvider theme={defaultHoliTheme}>
      <Suspense
        fallback={
          <SafeArea style={styles.loadingContainer}>
            <HoliText style={{ textAlign: 'center' }}>Loading...</HoliText>
          </SafeArea>
        }
      >
        <ErrorBoundary>
          <ApolloProvider client={apolloWebClient}>
            <PortalProvider>
              <ToastProvider>
                <LoginModalProvider>{children}</LoginModalProvider>
              </ToastProvider>
            </PortalProvider>
          </ApolloProvider>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  )
}

export default SSRRootProvider

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
