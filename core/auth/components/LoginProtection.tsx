import React, { useEffect, useState } from 'react'
import { Platform, StyleSheet } from 'react-native'

import { useNavigation } from '@react-navigation/native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { vars } from '@holi/ui/styles/globalVars'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { userId } = useAuth()
  const { isLoggedIn, isLoading: isUserLoading } = useLoggedInUser()
  const navigation = useNavigation()
  const [onboardingKey, setOnboardingKey] = useState(Date.now().toString())

  // user random key to reset registration onboarding when user goes to another app's path
  useEffect(() => {
    if (isLoggedIn) return

    const unsubscribe = navigation.addListener('focus', () => {
      setOnboardingKey(Date.now().toString())
    })
    return unsubscribe
  }, [navigation, isLoggedIn])

  if (userId === undefined || (!!userId && isUserLoading)) return <HoliLoader />

  return isLoggedIn ? <>{children}</> : <Onboarding style={styles.onboarding} key={onboardingKey} />
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
