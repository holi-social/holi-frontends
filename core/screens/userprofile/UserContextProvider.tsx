import { useQuery } from '@apollo/client'
import React, { createContext } from 'react'

import { useAuth } from '@holi/core/auth/AuthContextProvider'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { AuthenticatedUserResponse, authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'

interface UserContext {
  isLoading: boolean
  user: User | undefined
}

const initialState = {
  isLoading: true,
  user: undefined,
}

export const UserContext = createContext<UserContext>(initialState)
UserContext.displayName = 'UserContext'

const UserContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn, setUserLoggedOut } = useAuth()
  const { displayError } = useErrorHandling()

  const { loading, error, data } = useQuery<AuthenticatedUserResponse>(authenticatedUserQuery, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
  })

  if (error) {
    displayError(error)
    setUserLoggedOut()
  }

  const user = data?.authenticatedUser

  return <UserContext.Provider value={{ isLoading: loading, user }}>{children}</UserContext.Provider>
}

export default UserContextProvider
