import { useQuery } from '@apollo/client'
import React, { createContext } from 'react'

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
  // TODO implement fetching user context for logged-in user
  // Later: Possibly retrieve user id from auth context and load user by id here
  const { loading, error, data } = useQuery<AuthenticatedUserResponse>(authenticatedUserQuery)

  if (loading && !error) {
    return <HoliText>Loading...</HoliText>
  }

  if (error) {
    displayError(error, 'Error fetching authenticated user')
  }

  const user = data && data?.authenticatedUser

  return <UserContext.Provider value={{ user: user }}>{children}</UserContext.Provider>
}
