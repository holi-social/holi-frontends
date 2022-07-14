import { ApolloProvider } from '@apollo/client'
import React, { useContext } from 'react'
import { useTranslation } from 'react-i18next'
import { StyleSheet } from 'react-native'

import client from '@holi/api/graphql/client'
import { AuthContext, AuthContextProvider } from '@holi/core/auth/AuthProvider'
import ErrorBoundary from '@holi/core/errors/components/ErrorBoundary'
import { NavigationContextProvider } from '@holi/core/navigation/context'
import { UserContext, UserContextProvider } from '@holi/core/user/UserContextProvider'
import HoliText from '@holi/ui/components/HoliText'
import SafeArea from '@holi/ui/components/SafeArea'
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
const Children: React.VFC<{ children: React.ReactElement | React.ReactNode }> = ({ children }) => {
  const authContext = useContext(AuthContext)
  const userContext = useContext(UserContext)
  const { t } = useTranslation()

  return authContext.isLoading || userContext.isLoading ? (
    <SafeArea style={styles.loadingContainer}>
      <HoliText style={{ textAlign: 'center' }}>
        {/* TODO put loading spinner or something even nicer */}
        {authContext.isLoading && t('rootProvider.loading.login')}
        {userContext.isLoading && t('rootProvider.loading.profile')}
      </HoliText>
    </SafeArea>
  ) : (
    <NavigationContextProvider>{children}</NavigationContextProvider>
  )
}

const RootProvider: React.VoidFunctionComponent<{ children: React.ReactElement | React.ReactNode }> = ({
  children,
}) => {
  return (
    <ThemeProvider theme={defaultHoliTheme}>
      <ErrorBoundary>
        <ApolloProvider client={client}>
          <AuthContextProvider>
            <UserContextProvider>
              <Children>{children}</Children>
            </UserContextProvider>
          </AuthContextProvider>
        </ApolloProvider>
      </ErrorBoundary>
    </ThemeProvider>
  )
}

export default RootProvider
