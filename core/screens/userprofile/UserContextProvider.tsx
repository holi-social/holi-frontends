import { useQuery } from '@apollo/client'
import React, { createContext, useContext } from 'react'

import { setUserLoggedOut, useAuth } from '@holi/core/auth/helpers/useAuth'
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

const UserContext = createContext<UserContext>(initialState)
UserContext.displayName = 'UserContext'

export const useLoggedInUser = () => {
  const context = useContext(UserContext)

  if (context === undefined) throw new Error('useLoggedInUser() must be used within a UserContextProvider')

  return context
}

const UserContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { isLoggedIn } = useAuth()
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
