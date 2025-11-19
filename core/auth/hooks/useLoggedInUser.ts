import { useQuery } from '@apollo/client/react'
import { useEffect } from 'react'

import { useLoginState } from '@holi/core/auth/loginState'
import { type AuthenticatedUserV2Response, authenticatedUserV2Query } from '@holi/core/domain/shared/queries'
import type { AuthenticatedUser } from '@holi/core/domain/shared/types'
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
    // Prevents leaking data of a previously logged in user (FIXME: seems to happen despite clearing the cache)
    // Exceptions are SSR and initial hydration as the loginState is missing there
    variables: 'userId' in loginState ? { userId: loginState.userId } : undefined,
    // The user is pre-loaded during SSR and the result is already present in the cache (if it's missing, the user is not logged in)
    fetchPolicy: isSSR ? 'cache-only' : 'cache-first',
  })

  useEffect(() => {
    if (error) {
      displayError(error, 'Failed to load authenticated user', {
        location: 'useLoggedInUser.authenticatedUserQuery',
      })
    }
  }, [error, displayError])

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
