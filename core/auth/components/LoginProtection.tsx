import React from 'react'
import { StyleSheet } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import { vars } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn } = useAuth()
  const mixins = useStyleMixins()

  return isLoggedIn ? (
    <>{children}</>
  ) : (
    <LoginRegistration style={mixins.container} contentContainerStyle={styles.loginContentContainerStyle} />
  )
}

const styles = StyleSheet.create({
  loginContentContainerStyle: {
    paddingBottom: vars.bottomBarHeight,
  },
})

export default LoginProtection
