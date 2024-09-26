import { useQuery } from '@apollo/client'

import { useLoginState } from '@holi/core/auth/loginState'
import {
  AuthenticatedUserV2Response,
  AuthenticatedUserV2Variables,
  authenticatedUserV2Query,
} from '@holi/core/domain/shared/queries'
import { AuthenticatedUser } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'

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

export const loggedInUserLoading: LoggedInUserLoading = {
  state: 'loading',
  isLoading: true,
  isLoggedIn: false,
  isLoggedOut: false,
  user: undefined,
  refetch: () => Promise.resolve(),
}

export const loggedOut: LoggedOut = {
  state: 'loggedOut',
  isLoading: false,
  isLoggedIn: false,
  isLoggedOut: true,
  user: undefined,
  refetch: () => Promise.resolve(),
}

export const useLoggedInUser = (): LoggedInState => {
  const loginState = useLoginState()
  const { displayError } = useErrorHandling()

  const {
    data: { authenticatedUserV2: user } = {},
    loading: isLoadingAuthenticatedUser,
    refetch,
  } = useQuery<AuthenticatedUserV2Response, AuthenticatedUserV2Variables>(authenticatedUserV2Query, {
    skip: !loginState.isLoggedIn,
    onError: (error) => {
      displayError(error, 'Failed to load authenticated user', {
        location: 'useLoggedInUser.authenticatedUserQuery',
      })
    },
    // we avoid getting previous user from GraphQL cache by passing `userId`
    variables: {
      userId: loginState.isLoggedIn ? loginState.userId : undefined,
    },
  })

  if (loginState.isUnknown || isLoadingAuthenticatedUser || (loginState.isLoggedIn && !user)) {
    return loggedInUserLoading
  } else if (loginState.isLoggedOut) {
    return loggedOut
  } else {
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
