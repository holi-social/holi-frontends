import { useQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect } from 'react'

import { setUserLoggedOut, useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { AuthenticatedUserResponse, authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'

interface UserContext {
  user: User | undefined
  isLoggedIn: boolean
  isLoading: boolean
}

const initialState: UserContext = {
  user: undefined,
  isLoggedIn: false,
  isLoading: true,
}

const UserContext = createContext<UserContext>(initialState)
UserContext.displayName = 'UserContext'

export const useLoggedInUser = () => {
  const context = useContext(UserContext)

  if (context === undefined) throw new Error('useLoggedInUser() must be used within a UserContextProvider')

  return context
}

const UserContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const { userId } = useAuth()
  const { displayError } = useErrorHandling()

  const { loading, error, data } = useQuery<AuthenticatedUserResponse>(authenticatedUserQuery, {
    skip: !userId,
    fetchPolicy: 'network-only',
  })

  useEffect(() => {
    if (error) {
      setUserLoggedOut()
      displayError(error)
    }
  }, [displayError, error])

  const user = data?.authenticatedUser

  return (
    <UserContext.Provider
      value={{
        user,
        isLoggedIn: !!user,
        isLoading: loading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
