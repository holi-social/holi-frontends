import { useErrorHandling } from '@holi/core/errors/hooks'
import { createSearchParameters } from '@holi/core/screens/search/helpers/createSearchParameters'
import { isEmptyFilter } from '@holi/core/screens/search/helpers/isEmptyFilter'
import type { SearchFilter } from '@holi/core/screens/search/types'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { useMemo } from 'react'

export const useSearchResults = (filter: SearchFilter) => {
  const { displayError } = useErrorHandling()
  const parameters = useMemo(() => createSearchParameters(filter), [filter])
  const { state, fetchNextPage, refetch } = useTypesensePaginationQuery({
    parameters,
    skip: isEmptyFilter(filter),
    onError: (error) => {
      displayError(error, 'Error retrieving search results', {
        location: 'useSearchResults.useTypesensePaginationQuery',
      })
    },
  })

  return {
    searchResults: state,
    fetchNextPage,
    refetch,
  }
}
