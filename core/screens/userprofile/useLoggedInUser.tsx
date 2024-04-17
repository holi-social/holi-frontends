import { useQuery } from '@apollo/client'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { AuthenticatedUserResponse, authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'

export const useLoggedInUser = () => {
  const { userId, isUninitialized } = useAuth()
  const { displayError } = useErrorHandling()

  const {
    data: { authenticatedUser: user } = {},
    loading: isLoadingAuthenticatedUser,
    refetch,
  } = useQuery<AuthenticatedUserResponse>(authenticatedUserQuery, {
    skip: !userId,
    onError: (error) => {
      displayError(error, 'Failed to load authenticated user', {
        location: 'useLoggedInUser.authenticatedUserQuery',
      })
    },
    // we avoid getting previous user from GraphQL cache by passing `userId`
    variables: {
      userId,
    },
  })

  return {
    user,
    isLoggedIn: !!user,
    isLoading: isLoadingAuthenticatedUser || isUninitialized,
    refetch,
  }
}
