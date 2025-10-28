import { useRepresentativeBySpaceIdQuery } from '@holi/api/graphql/graphql-codegen'
import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { useEffect } from 'react'

export const useRepresentative = (spaceIdOrName?: string) => {
  const { displayError } = useErrorHandling()

  const { loading, error, data, refetch } = useRepresentativeBySpaceIdQuery({
    fetchPolicy: 'no-cache',
    variables: { idOrName: spaceIdOrName ?? '' },
    skip: !spaceIdOrName,
  })
  useEffect(() => {
    if (error && !isNotFoundError(error)) {
      displayError(error, 'Failed to load space Representative', {
        location: 'useRepresentative.representativeBySpaceIdQuery',
        spaceIdOrName,
      })
    }
  }, [error, displayError, spaceIdOrName])

  const representative = data?.spaceById?.representatives[0].user

  return {
    loading,
    error,
    representative,
    refetch,
  }
}
