import { useQuery } from '@apollo/client'
import React, { createContext, useContext } from 'react'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLogout } from '@holi/core/helpers'
import { useOnboarding } from '@holi/core/screens/onboarding/hooks'
import { AuthenticatedUserResponse, authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'

interface UserContext {
  user: User | null | undefined
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
  const { logout } = useLogout()
  const { onOnboardingStateChange } = useOnboarding()

  const { loading, data } = useQuery<AuthenticatedUserResponse>(authenticatedUserQuery, {
    skip: !userId,
    fetchPolicy: 'network-only',
    onError: (error) => {
      onOnboardingStateChange('finished')
      logout()
      displayError(error)
    },
  })

  // before `authenticatedUserQuery` has been resolved `currentUser` is `undefined`
  // after resolving query `currentUser` becomes either `User` object or `null` if no user is logged-in
  const currentUser: User | null | undefined = data ? data.authenticatedUser || null : undefined

  return (
    <UserContext.Provider
      value={{
        user: currentUser,
        isLoggedIn: !!currentUser,
        isLoading: loading,
      }}
    >
      {children}
    </UserContext.Provider>
  )
}

export default UserContextProvider
