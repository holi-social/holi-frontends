import React from 'react'
import { Platform, StyleSheet } from 'react-native'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'
import { vars } from '@holi/ui/styles/globalVars'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn } = useAuth()

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
