import { ApolloProvider } from '@apollo/client'
import type { PropsWithChildren } from 'react'
import React, { Suspense } from 'react'
import { StyleSheet } from 'react-native'

import AuthContextProvider from '@holi/core/auth/AuthContextProvider'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import type { ApolloStateProps } from '@holi/core/helpers/useApolloSSRClient'
import { useApolloClient } from '@holi/core/helpers/useApolloSSRClient'
import { NavigationContextProvider } from '@holi/core/navigation/hooks/NavigationContextProvider'
import LoginRedirectProvider from '@holi/core/provider/LoginRedirectProvider'
import PortalProvider from '@holi/core/provider/PortalProvider'
import UserContextProvider from '@holi/core/screens/userprofile/UserContextProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'
import SafeArea from '@holi/ui/components/atoms/SafeArea'
import { ToastProvider } from '@holi/ui/components/molecules/HoliToastProvider'
import defaultHoliTheme, { ThemeProvider } from '@holi/ui/styles/theme'

interface RootProviderProps {
  pageProps: ApolloStateProps
}

const SSRRootProvider = ({ children, pageProps }: PropsWithChildren<RootProviderProps>) => {
  const apolloWebClient = useApolloClient(pageProps)

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
            <AuthContextProvider>
              <UserContextProvider>
                <LoginRedirectProvider>
                  <PortalProvider>
                    <ToastProvider>
                      <NavigationContextProvider>{children}</NavigationContextProvider>
                    </ToastProvider>
                  </PortalProvider>
                </LoginRedirectProvider>
              </UserContextProvider>
            </AuthContextProvider>
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
