import React from 'react'
import { Platform, StyleSheet } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { useLoggedInUser } from '@holi/core/screens/userprofile/UserContextProvider'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'
import { vars } from '@holi/ui/styles/globalVars'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { userId, isLoggedIn } = useAuth()
  const { isLoading: isUserLoading } = useLoggedInUser()

  if (userId === undefined || (isLoggedIn && isUserLoading)) return <HoliLoader />

  return isLoggedIn ? <>{children}</> : <Onboarding style={styles.onboarding} />
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
