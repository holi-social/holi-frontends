import React from 'react'
import { Platform, StyleSheet } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
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

  if (userId === undefined || (!!userId && isUserLoading)) return <HoliLoader testID="loader" />

  return isOnboardingFinished && isLoggedIn ? <>{children}</> : <Onboarding style={styles.onboarding} />
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
