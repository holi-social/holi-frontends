import React, { useCallback } from 'react'
import { Platform, StyleSheet } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { dimensions } from '@holi/ui/styles/globalVars'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { loginState } = useAuth()
  const { isLoggedIn, isLoading: isUserLoading } = useLoggedInUser()
  const { storedOnboardingState } = useStoredOnboardingState()
  const isOnboardingFinished = storedOnboardingState === 'finished'
  const { navigate } = useRouting()

  const redirectToHomeScreenOnboarding = useCallback(() => {
    navigate(Platform.OS === 'web' ? '/' : '/onboarding')
  }, [navigate])

  if (loginState === 'loggedIn' && isUserLoading) return <HoliLoader testID="loader" />

  return isOnboardingFinished && isLoggedIn ? (
    <>{children}</>
  ) : (
    <Onboarding afterAccountCreated={redirectToHomeScreenOnboarding} style={styles.onboarding} />
  )
}

export default LoginProtection

const styles = StyleSheet.create({
  onboarding: {
    ...Platform.select({
      web: {
        minHeight: '100%',
        paddingBottom: dimensions.bottomBarHeight,
      },
    }),
  },
})
