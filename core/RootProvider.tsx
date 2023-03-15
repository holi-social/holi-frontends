import { ApolloProvider } from '@apollo/client'
import type { PropsWithChildren } from 'react'
import React, { Suspense, useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import client from '@holi/api/graphql/client'
import AuthContextProvider, { useAuth } from '@holi/core/auth/AuthContextProvider'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
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
              <AuthContextProvider>
                <UserContextProvider>
                  <LoginRedirectProvider>
                    <PortalProvider>
                      <Children>{children}</Children>
                    </PortalProvider>
                  </LoginRedirectProvider>
                </UserContextProvider>
              </AuthContextProvider>
            </ToastProvider>
          </ApolloProvider>
        </ErrorBoundary>
      </Suspense>
    </ThemeProvider>
  )
}

export default RootProvider
