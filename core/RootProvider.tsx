import { ApolloProvider } from '@apollo/client'
import React, { Suspense, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { Platform, StyleSheet } from 'react-native'

import client from '@holi/api/graphql/client'
import AuthContextProvider, { useAuth } from '@holi/core/auth/AuthContextProvider'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import type { ApolloStateProps } from '@holi/core/helpers/useApolloSSRClient'
import { useApolloClient } from '@holi/core/helpers/useApolloSSRClient'
import { NavigationContextProvider } from '@holi/core/navigation/hooks/NavigationContextProvider'
import LoginRedirectProvider from '@holi/core/provider/LoginRedirectProvider'
import PortalProvider from '@holi/core/provider/PortalProvider'
import UserContextProvider, { UserContext } from '@holi/core/screens/userprofile/UserContextProvider'
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

const isWeb = Platform.OS === 'web'

// need to put this into separate component so it is wrapped with
// AuthContextProvider & UserContextProvider. it it's not wrapped
// useContext would not receive updates on context updates
const Children = ({ children }: React.PropsWithChildren<unknown>) => {
  const authContext = useAuth()
  const userContext = useContext(UserContext)
  const { t } = useTranslation()

  return authContext.isLoading || userContext.isLoading ? (
    <NavigationContextProvider>
      <SafeArea style={styles.loadingContainer}>
        <HoliText style={{ textAlign: 'center' }}>
          {/* TODO put loading spinner or something even nicer */}
          {authContext.isLoading && t('rootProvider.loading.login')}
          {userContext.isLoading && t('rootProvider.loading.profile')}
        </HoliText>
      </SafeArea>
    </NavigationContextProvider>
  ) : (
    <NavigationContextProvider>{children}</NavigationContextProvider>
  )
}

interface RootProviderProps {
  pageProps: ApolloStateProps
}

const RootProvider = ({ children, pageProps }: React.PropsWithChildren<RootProviderProps>) => {
  const apolloWebClient = useApolloClient(pageProps)

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
          <ApolloProvider client={isWeb ? apolloWebClient : client}>
            <AuthContextProvider>
              <UserContextProvider>
                <LoginRedirectProvider>
                  <PortalProvider>
                    <ToastProvider>
                      <Children>{children}</Children>
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

export default RootProvider
