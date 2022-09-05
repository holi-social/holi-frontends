import { useQuery } from '@apollo/client'
import React, { createContext, useContext } from 'react'
import { useTranslation } from 'react-i18next'

import { AuthContext } from '@holi/core/auth/AuthContextProvider'
import { displayError } from '@holi/core/errors/helpers'
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
UserContext.displayName = 'UserContext'

const UserContextProvider: React.FC = ({ children }) => {
  const { isLoggedIn } = useContext(AuthContext)
  const { t } = useTranslation()

  const { loading, error, data } = useQuery<AuthenticatedUserResponse>(authenticatedUserQuery, {
    skip: !isLoggedIn,
    fetchPolicy: 'network-only',
  })

  if (error) {
    displayError(error, t('user.userContext.error.fetching'))
  }

  const user = data?.authenticatedUser

  return <UserContext.Provider value={{ isLoading: loading, user }}>{children}</UserContext.Provider>
}

export default UserContextProvider
