import React from 'react'
import { StyleSheet } from 'react-native'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import { colors } from '@holi/ui/styles/globalVars'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn } = useAuth()
  const mixins = useStyleMixins()

  return isLoggedIn ? <>{children}</> : <LoginRegistration style={[mixins.container, styles.loginRegistration]} />
}

const styles = StyleSheet.create({
  loginRegistration: {
    backgroundColor: colors.background20,
  },
})

export default LoginProtection
