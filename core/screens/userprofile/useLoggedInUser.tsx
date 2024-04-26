import { useQuery } from '@apollo/client'

import { LoginStateLoggedIn, useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { AuthenticatedUserResponse, authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'
import { AuthenticatedUser } from '@holi/core/screens/userprofile/types'

export interface LoggedInUserLoading {
  state: 'loading'
  isLoading: true
  isLoggedIn: false
  isLoggedOut: false
  user: undefined
  refetch: (...args: never[]) => Promise<unknown>
}

export interface LoggedOut {
  state: 'loggedOut'
  isLoading: false
  isLoggedIn: false
  isLoggedOut: true
  user: undefined
  refetch: (...args: never[]) => Promise<unknown>
}

export interface LoggedInUser {
  state: 'loggedIn'
  isLoading: false
  isLoggedIn: true
  isLoggedOut: false
  user: AuthenticatedUser
  refetch: (...args: never[]) => Promise<unknown>
}

export type LoggedInState = LoggedInUserLoading | LoggedOut | LoggedInUser

const loading: LoggedInUserLoading = {
  state: 'loading',
  isLoading: true,
  isLoggedIn: false,
  isLoggedOut: false,
  user: undefined,
  refetch: () => Promise.resolve(),
}

const loggedOut: LoggedOut = {
  state: 'loggedOut',
  isLoading: false,
  isLoggedIn: false,
  isLoggedOut: true,
  user: undefined,
  refetch: () => Promise.resolve(),
}

export const useLoggedInUser = (): LoggedInState => {
  const loginState = useAuth()
  const { displayError } = useErrorHandling()

  const {
    data: { authenticatedUserV2: user } = {},
    loading: isLoadingAuthenticatedUser,
    refetch,
  } = useQuery<AuthenticatedUserResponse>(authenticatedUserQuery, {
    skip: loginState.loginState !== 'loggedIn',
    onError: (error) => {
      displayError(error, 'Failed to load authenticated user', {
        location: 'useLoggedInUser.authenticatedUserQuery',
      })
    },
    // we avoid getting previous user from GraphQL cache by passing `userId`
    variables: {
      userId: loginState.isLoggedIn ? (loginState as LoginStateLoggedIn).userId : undefined,
    },
  })

  if (loginState.isUnknown) return loading
  else if (loginState.isLoggedOut) return loggedOut
  else {
    if (isLoadingAuthenticatedUser) return loading
    else
      return {
        state: 'loggedIn',
        isLoading: false,
        isLoggedIn: true,
        isLoggedOut: false,
        user: user as AuthenticatedUser,
        refetch,
      }
  }
}
