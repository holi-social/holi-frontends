import { useQuery } from '@apollo/client'
import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { spaceRepresentative, type RepresentativeBySpaceIdResponse } from '@holi/core/screens/spaces/queries'

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

  const representative = data?.spaceById
  const representativeIdentity =
    representative && representative?.representatives?.length > 0 ? representative?.representatives[0] : undefined

  return {
    loading,
    error,
    representativeIdentity: representativeIdentity?.user?.identity,
    called,
    refetch,
  }
}
