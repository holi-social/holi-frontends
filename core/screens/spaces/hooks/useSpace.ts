import { QueryHookOptions, useQuery } from '@apollo/client'

import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { SpaceByIdResponse, spaceByIdQuery } from '@holi/core/screens/spaces/queries'

export const useSpace = (spaceIdOrName?: string, options?: QueryHookOptions<SpaceByIdResponse>) => {
  const { displayError } = useErrorHandling()
  const { replaceRoute } = useRouting()
  // On initial page load on web `spaceIdOrName` is undefined
  // > will probably be solved with ssr
  // see https://github.com/nandorojo/solito/issues/100
  const { loading, error, data, called, refetch } = useQuery<SpaceByIdResponse>(spaceByIdQuery, {
    ...options,
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
