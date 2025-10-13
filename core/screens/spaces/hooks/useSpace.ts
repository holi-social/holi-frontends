import { useSpaceByIdQuery } from '@holi/api/graphql/graphql-codegen'
import { useEffect } from 'react'

import { isNotFoundError } from '@holi/core/errors/helpers'
import { useErrorHandling } from '@holi/core/errors/hooks'
import { isSSR } from '@holi/core/helpers/isSSR'
import useRouting from '@holi/core/navigation/hooks/useRouting'

export const useSpace = (spaceIdOrName?: string) => {
  const { displayError } = useErrorHandling()
  const { replaceRoute } = useRouting()
  const { loading, error, data, called, refetch } = useSpaceByIdQuery({
    fetchPolicy: isSSR ? 'cache-first' : 'cache-and-network', // ensures that all required fields are eventually present for members
    variables: { idOrName: spaceIdOrName ?? '' },
    skip: !spaceIdOrName,
  })

  useEffect(() => {
    if (error) {
      if (isNotFoundError(error)) {
        replaceRoute('/404')
        return
      }
      displayError(error, 'Failed to load space', {
        location: 'useSpace.spaceByIdQuery',
        spaceIdOrName,
      })
    }
  }, [error, displayError, replaceRoute, spaceIdOrName])

  const space = data?.spaceById

  return { loading, error, space, called, refetch }
}
