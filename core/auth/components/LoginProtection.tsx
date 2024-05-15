import React from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import AnonymousProfileView from '@holi/core/screens/userprofile/components/AnonymousProfileView'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { loginState } = useAuth()
  const { isLoggedIn, isLoading: isUserLoading } = useLoggedInUser()

  if (loginState === 'unknown' || isUserLoading) return <HoliLoader />

  return isLoggedIn ? <>{children}</> : <AnonymousProfileView />
}

export default LoginProtection
