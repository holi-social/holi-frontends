import React, { useCallback, useEffect, useState } from 'react'
import { Platform, StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { useStoredOnboardingState } from '@holi/core/screens/onboarding/hooks'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { vars } from '@holi/ui/styles/globalVars'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn, isLoading: isUserIDLoading } = useAuth()
  const { isLoading: isUserLoading } = useLoggedInUser()
  const navigation = useNavigation()
  const [onboardingKey, setOnboardingKey] = useState(Date.now().toString())
  const { storedOnboardingState } = useStoredOnboardingState()
  const isOnboardingFinished = storedOnboardingState === 'finished'
  const { navigate } = useRouting()

  const redirectToHomeScreenOnboarding = useCallback(() => {
    navigate(Platform.OS === 'web' ? '/' : '/onboarding')
  }, [navigate])

  // user random key to reset registration onboarding when user goes to another app's path
  useEffect(() => {
    if (isLoggedIn) return

    const unsubscribe = navigation.addListener('focus', () => {
      setOnboardingKey(Date.now().toString())
    })

    return unsubscribe
  }, [navigation, isLoggedIn])

  if (isUserIDLoading || isUserLoading) return <HoliLoader />

  return isOnboardingFinished && isLoggedIn ? (
    <>{children}</>
  ) : (
    <Onboarding afterAccountCreated={redirectToHomeScreenOnboarding} style={styles.onboarding} key={onboardingKey} />
  )
}

export default LoginProtection

const styles = StyleSheet.create({
  onboarding: {
    ...Platform.select({
      web: {
        minHeight: '100%',
        paddingBottom: +vars.bottomBarHeight,
      },
    }),
  },
})
