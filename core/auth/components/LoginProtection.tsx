import React from 'react'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import Onboarding from '@holi/core/screens/onboarding/Onboarding'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn } = useAuth()

  return isLoggedIn ? <>{children}</> : <Onboarding />
}

export default LoginProtection
