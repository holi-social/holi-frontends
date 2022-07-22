import { useLazyQuery } from '@apollo/client'
import React, { createContext, useContext, useEffect } from 'react'
import { useTranslation } from 'react-i18next'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import useErrorHandling from '@holi/core/errors/useErrorHandling'
import { AuthenticatedUserResponse, authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'
import type { User } from '@holi/core/screens/userprofile/types'

interface Context {
  isLoading: boolean
  user: User | undefined
}

const initialState = {
  isLoading: true,
  user: undefined,
}

export const UserContext = createContext<Context>(initialState)

export const UserContextProvider: React.FC = ({ children }) => {
  const { displayError } = useErrorHandling()
  const { isLoggedIn } = useContext(AuthContext)
  const { t } = useTranslation()

  const [getAuthenticatedUser, { loading, error, data }] =
    useLazyQuery<AuthenticatedUserResponse>(authenticatedUserQuery)

  useEffect(() => {
    // only run when user is authenticated. if he's not authenticated the result
    // is always null/undefined anyway.
    if (isLoggedIn) {
      getAuthenticatedUser()
    }
  }, [isLoggedIn, getAuthenticatedUser])

  if (error) {
    displayError(error, t('user.userContext.error.fetching'))
  }

  const user = data && data?.authenticatedUser

  return <UserContext.Provider value={{ isLoading: loading, user: user }}>{children}</UserContext.Provider>
}
