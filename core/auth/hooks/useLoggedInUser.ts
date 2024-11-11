import { useQuery } from '@apollo/client'

import { useLoginState } from '@holi/core/auth/loginState'
import { AuthenticatedUserV2Response, authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import { AuthenticatedUser } from '@holi/core/domain/shared/types'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'

export interface LoggedInUserLoading {
  state: 'loading'
  isLoading: true
  isLoggedIn: false
  isLoggedOut: false
  user: undefined
}

export interface LoggedOut {
  state: 'loggedOut'
  isLoading: false
  isLoggedIn: false
  isLoggedOut: true
  user: undefined
}

export interface LoggedInUser {
  state: 'loggedIn'
  isLoading: false
  isLoggedIn: true
  isLoggedOut: false
  user: AuthenticatedUser
}

export type LoggedInState = LoggedInUserLoading | LoggedOut | LoggedInUser

export const loggedInUserLoading: LoggedInUserLoading = {
  state: 'loading',
  isLoading: true,
  isLoggedIn: false,
  isLoggedOut: false,
  user: undefined,
}

export const loggedOut: LoggedOut = {
  state: 'loggedOut',
  isLoading: false,
  isLoggedIn: false,
  isLoggedOut: true,
  user: undefined,
}

export const useLoggedInUser = (): LoggedInState => {
  const loginState = useLoginState()
  const { displayError } = useErrorHandling()

  const {
    data: { authenticatedUserV2: user } = {},
    error,
  } = useQuery<AuthenticatedUserV2Response>(authenticatedUserV2Query, {
    skip: loginState.isLoggedOut,
    // The user is pre-loaded during SSR and the result is already present in the cache (if it's missing, the user is not logged in)
    fetchPolicy: isSSR ? 'cache-only' : 'cache-first',
    onError: (error) => {
      displayError(error, 'Failed to load authenticated user', {
        location: 'useLoggedInUser.authenticatedUserQuery',
      })
    },
  })

  if (loginState.isLoggedOut || error || (!user && isSSR)) {
    return loggedOut
  } else if (user) {
    return {
      state: 'loggedIn',
      isLoading: false,
      isLoggedIn: true,
      isLoggedOut: false,
      user: user as AuthenticatedUser,
    }
  } else {
    return loggedInUserLoading
  }
}
