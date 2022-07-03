import { useLazyQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect } from 'react'

import { AuthContext } from '@holi/core/auth/AuthProvider'
import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { AuthenticatedUserResponse, authenticatedUserQuery } from '@holi/core/user/queries'
import { User } from '@holi/core/user/types'
import HoliText from '@holi/ui/components/HoliText'

interface Context {
  user: User | undefined
}

export const UserContext = createContext<Context>({
  user: undefined,
})

export const UserContextProvider: React.FC = ({ children }) => {
  const { displayError } = useErrorHandling()
  const { isAuthenticated } = useContext(AuthContext)

  const [getAuthenticatedUser, { loading, error, data }] =
    useLazyQuery<AuthenticatedUserResponse>(authenticatedUserQuery)

  useEffect(() => {
    // only run when user is authenticated. if he's not authenticated the result
    // is always null/undefined anyway.
    if (isAuthenticated) {
      getAuthenticatedUser()
    }
  }, [isAuthenticated])

  if (!isAuthenticated) {
    return <UserContext.Provider value={{ user: undefined }}>{children}</UserContext.Provider>
  }

  if (loading && !error) {
    return <HoliText>Loading...</HoliText>
  }

  if (error) {
    displayError(error, 'Error fetching authenticated user')
  }

  const user = data && data?.authenticatedUser

  return <UserContext.Provider value={{ user: user }}>{children}</UserContext.Provider>
}
