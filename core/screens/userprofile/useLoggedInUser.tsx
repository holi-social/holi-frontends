import { useQuery } from '@apollo/client'

import { useAuth } from '@holi/core/auth/helpers/useAuth'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useLogout } from '@holi/core/helpers'
import { AuthenticatedUserResponse, authenticatedUserQuery } from '@holi/core/screens/userprofile/queries'

export const useLoggedInUser = () => {
  const { userId } = useAuth()
  const { displayError } = useErrorHandling()
  const { logout } = useLogout()

  const { data: { authenticatedUser: user } = {}, loading } = useQuery<AuthenticatedUserResponse>(
    authenticatedUserQuery,
    {
      skip: !userId,
      fetchPolicy: 'cache-and-network',
      onError: (error) => {
        logout({ redirectPath: '/' })
        displayError(error)
      },
    }
  )

  return {
    user,
    isLoggedIn: !!user,
    isLoading: loading,
  }
}
