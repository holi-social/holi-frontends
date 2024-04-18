import { useQuery } from '@apollo/client'

import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'

export const useSpace = (spaceIdOrName?: string) => {
  const { displayError } = useErrorHandling()
  const { replaceRoute } = useRouting()
  const { loading, error, data, called, refetch } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network', // ensures that all required fields are eventually present for members
    variables: { idOrName: spaceIdOrName },
    skip: !spaceIdOrName,
    onError: (error) => {
      if (isNotFoundError(error)) {
        return replaceRoute('/404')
      }
      displayError(error, 'Failed to load space', {
        location: 'useSpace.spaceByIdQuery',
        spaceIdOrName,
      })
    },
  })

  const space = data?.spaceById

  return { loading, error, space, called, refetch }
}
