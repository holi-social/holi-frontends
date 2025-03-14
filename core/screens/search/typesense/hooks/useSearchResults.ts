import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  createSearchParameters,
  INITIAL_PAGE,
  PAGE_SIZE,
} from '@holi/core/screens/search/typesense/helpers/createSearchParameters'
import { createTypesenseClient } from '@holi/core/screens/search/typesense/helpers/createTypesenseClient'
import type { SearchFilter, SearchResults } from '@holi/core/screens/search/typesense/types'
import { useCallback, useEffect, useState } from 'react'

const typesenseClient = createTypesenseClient()

const isSameFilter = (filter1: SearchFilter, filter2: SearchFilter) => {
  return (
    filter1.query === filter2.query && filter1.facet === filter2.facet && filter1.location?.id === filter2.location?.id
  )
}

export const useSearchResults = (filter: SearchFilter) => {
  const { displayError } = useErrorHandling()
  const [isLoading, setIsLoading] = useState(false)
  const [searchResults, setSearchResults] = useState<SearchResults>({
    hits: [],
    totalNrOfResults: 0,
    totalNrOfPages: 0,
    currentPage: INITIAL_PAGE,
    canLoadMore: false,
    filter,
  })

  const performSearch = useCallback(
    (pageToLoad: number = INITIAL_PAGE) => {
      if (isLoading && isSameFilter(searchResults.filter, filter)) {
        return
      }
      setIsLoading(true)
      typesenseClient
        .search(createSearchParameters(filter, pageToLoad))
        .then((searchResults) => {
          setSearchResults((previousResults) => {
            const sameFilter = isSameFilter(previousResults.filter, filter)
            const previousHits = sameFilter && searchResults.page > INITIAL_PAGE ? previousResults.hits : []
            const totalNrOfPages = Math.ceil(searchResults.found / PAGE_SIZE)
            return {
              hits: [...previousHits, ...(searchResults.hits ?? [])],
              totalNrOfResults: searchResults.found,
              totalNrOfPages,
              currentPage: searchResults.page,
              canLoadMore: searchResults.page < totalNrOfPages,
              filter,
            }
          })
        })
        .catch((error) =>
          displayError(error, 'Error retrieving search results', {
            location: 'useSearchResults.performSearch',
          })
        )
        .finally(() => setIsLoading(false))
    },
    [isLoading, searchResults.filter, filter, displayError]
  )

  const loadMore = useCallback(() => {
    return performSearch(searchResults.currentPage + 1)
  }, [performSearch, searchResults.currentPage])

  const refresh = useCallback(() => {
    return performSearch(INITIAL_PAGE)
  }, [performSearch])

  // Reset search on filter changes
  useEffect(() => {
    // setResults([]) TODO(SF) maybe this helps with pagination issue?
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return {
    isLoading,
    searchResults,
    loadMore,
    refresh,
  }
}
