import React from 'react'

import { useLoginState } from '@holi/core/auth/loginState'
import AnonymousProfileView from '@holi/core/screens/userprofile/components/AnonymousProfileView'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const loginState = useLoginState()
  const { isLoggedIn, isLoading: isUserLoading } = useLoggedInUser()

  if (loginState.isUnknown || isUserLoading) return <HoliLoader testID="loader" />

  return isLoggedIn ? <>{children}</> : <AnonymousProfileView />
}

export default LoginProtection
