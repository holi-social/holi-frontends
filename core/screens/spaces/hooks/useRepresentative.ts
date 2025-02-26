import { useQuery } from '@apollo/client'
import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { type RepresentativeBySpaceIdResponse, spaceRepresentative } from '@holi/core/screens/spaces/queries'

export const useRepresentative = (spaceIdOrName?: string) => {
  const { displayError } = useErrorHandling()

  const { loading, error, data, called, refetch } = useQuery<RepresentativeBySpaceIdResponse>(spaceRepresentative, {
    fetchPolicy: 'no-cache',
    variables: { idOrName: spaceIdOrName },
    skip: !spaceIdOrName,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return null
      }
      displayError(error, 'Failed to load space Representative', {
        location: 'useRepresentative.representativeBySpaceIdQuery',
        spaceIdOrName,
      })
    },
  })

  const representative = data?.spaceById.representatives[0].user

  return {
    loading,
    error,
    representative,
    called,
    refetch,
  }
}
