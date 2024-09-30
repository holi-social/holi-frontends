import React from 'react'

import AnonymousProfileView from '@holi/core/screens/userprofile/components/AnonymousProfileView'
import { useLoggedInUser } from '@holi/core/screens/userprofile/useLoggedInUser'
import HoliLoader from '@holi/ui/components/molecules/HoliLoader'

const LoginProtection = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn, isLoading } = useLoggedInUser()

  if (isLoading) return <HoliLoader testID="loader" />

  return isLoggedIn ? <>{children}</> : <AnonymousProfileView />
}

export default LoginProtection
