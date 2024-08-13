import { useQuery } from '@apollo/client'

import { useLoginState } from '@holi/core/auth/loginState'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { onboardingStateVar, storeOnboardingState } from '@holi/core/screens/onboarding/hooks'
import {
  AuthenticatedUserV2Response,
  AuthenticatedUserV2Variables,
  authenticatedUserV2Query,
} from '@holi/core/screens/userprofile/queries'
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
  const loginState = useLoginState()
  const { displayError } = useErrorHandling()
  const { navigate } = useRouting()

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
    onCompleted: async ({ authenticatedUserV2: { identity } }) => {
      // check if user has `identity`.
      // if not, user needs to provide his/her name and lastname
      // to get it we redirect user to Onboarding `accoutSetup` step
      const currentOnboardingState = onboardingStateVar()

      if (!identity && currentOnboardingState !== 'emailVerification') {
        await storeOnboardingState('accountSetup')
        navigate('/onboarding/registration')
      }
    },
  })

  if (loginState.isUnknown || isLoadingAuthenticatedUser) {
    return loading
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
