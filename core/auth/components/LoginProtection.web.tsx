import React, { useCallback } from 'react'
import { Platform, StyleSheet } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { vars } from '@holi/ui/styles/globalVars'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { userId } = useAuth()
  const { isLoggedIn, isLoading: isUserLoading } = useLoggedInUser()
  const { onboardingState } = useOnboarding()
  const isOnboardingFinished = onboardingState === 'finished'
  const { navigate } = useRouting()

  const redirectToHomeScreenOnboarding = useCallback(() => {
    navigate(Platform.OS === 'web' ? '/' : '/onboarding')
  }, [navigate])

  if (userId === undefined || (!!userId && isUserLoading)) return <HoliLoader testID="loader" />

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
        paddingBottom: vars.bottomBarHeight,
      },
    }),
  },
})
