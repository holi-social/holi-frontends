import { useErrorHandling } from '@holi/core/errors/hooks'
import { createSearchParameters } from '@holi/core/screens/search/helpers/createSearchParameters'
import { isEmptyFilter } from '@holi/core/screens/search/helpers/isEmptyFilter'
import type { SearchFilter } from '@holi/core/screens/search/types'
import { useTypesensePaginationQuery } from '@holi/core/typesense/hooks/useTypesensePaginationQuery'
import { useMemo } from 'react'

export const useSearchResults = (filter: SearchFilter) => {
  const { displayError } = useErrorHandling()
  const parameters = useMemo(() => {
    console.log('\n📊 USE SEARCH RESULTS 📊')
    console.log('Filter input:', filter)
    const result = createSearchParameters(filter)
    console.log('Parameters created:', result)
    console.log('📊 END USE SEARCH RESULTS 📊\n')
    return result
  }, [filter])
  
  const { state, isLoading, fetchNextPage, refetch } = useTypesensePaginationQuery({
    parameters,
    skip: isEmptyFilter(filter),
    onError: (error) => {
      displayError(error, 'Error retrieving search results', {
        location: 'useSearchResults.useTypesensePaginationQuery',
      })
    },
  })

  return {
    isLoading,
    searchResults: state,
    fetchNextPage,
    refetch,
  }
}
