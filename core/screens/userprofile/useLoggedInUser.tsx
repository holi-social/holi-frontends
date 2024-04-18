import { useQuery } from '@apollo/client'

import { LoginStateLoggedIn, useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { AuthenticatedUserResponse, authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'

export const useLoggedInUser = () => {
  const loginState = useAuth()
  const { displayError } = useErrorHandling()

  const {
    data: { authenticatedUser: user } = {},
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

  return {
    user,
    isLoggedIn: !!user,
    isLoading: isLoadingAuthenticatedUser || loginState.isUnknown,
    refetch,
  }
}
