import { useQuery } from '@apollo/client'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { isUnauthorizedError } from '@holi/core/errors/helpers'
import { isNetworkConnectionError } from '@holi/core/errors/helpers/logError.shared'
import { useErrorHandling } from '@holi/core/errors/hooks'
// import { useLogout } from '@holi/core/helpers'
import { AuthenticatedUserResponse, authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'

export const useLoggedInUser = () => {
  const { userId } = useAuth()
  const { displayError } = useErrorHandling()
  // const { logout } = useLogout()

  const {
    data: { authenticatedUser: user } = {},
    loading,
    refetch,
  } = useQuery<AuthenticatedUserResponse>(authenticatedUserQuery, {
    skip: !userId,
    fetchPolicy: 'cache-first',
    onError: (error) => {
      if (!isNetworkConnectionError(error) && !isUnauthorizedError(error)) {
        // logout({ redirectPath: '/' })
        displayError(error, 'Failed to load authenticated user', {
          location: 'useLoggedInUser.authenticatedUserQuery',
        })
      }
    },
    // we avoid getting previous user from GraphQL cache by passing `userId`
    variables: {
      userId,
    },
  })

  return {
    user,
    // TODO: refactor all splaces and use `isLoggedIn` from `useAuth()` hook instead
    isLoggedIn: !!user,
    isLoading: loading,
    refetch,
  }
}
