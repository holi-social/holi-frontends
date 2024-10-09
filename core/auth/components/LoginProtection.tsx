import React from 'react'

import { useLoggedInUser } from '@holi/core/auth/hooks/useLoggedInUser'
import AnonymousProfileView from '@holi/core/screens/userprofile/components/AnonymousProfileView'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn, isLoading } = useLoggedInUser()

  if (isLoading) return <HoliLoader testID="loader" />

  return isLoggedIn ? <>{children}</> : <AnonymousProfileView />
}

export default LoginProtection
