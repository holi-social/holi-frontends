import React from 'react'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import LoginRegistration from '@holi/core/auth/components/LoginRegistration'
import { useStyleMixins } from '@holi/ui/styles/theme/mixins'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn } = useAuth()
  const mixins = useStyleMixins()

  return isLoggedIn ? <>{children}</> : <LoginRegistration style={mixins.container} />
}

export default LoginProtection
