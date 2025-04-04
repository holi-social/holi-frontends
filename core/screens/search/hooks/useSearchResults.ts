import { useErrorHandling } from '@holi/core/errors/hooks'
import {
  createSearchParameters,
  INITIAL_PAGE,
  PAGE_SIZE,
} from '@holi/core/screens/search/helpers/createSearchParameters'
import { createTypesenseClient } from '@holi/core/typesense/helpers/createTypesenseClient'
import { isEmptyFilter } from '@holi/core/screens/search/helpers/isEmptyFilter'
import type { SearchFilter, SearchResults } from '@holi/core/screens/search/types'
import { useCallback, useEffect, useState } from 'react'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { typesenseCollection } from '@holi/core/helpers/config'

const typesenseClient = createTypesenseClient()

const isSameFilter = (filter1: SearchFilter, filter2: SearchFilter) => {
  return (
    filter1.query === filter2.query && filter1.facet === filter2.facet && filter1.location?.id === filter2.location?.id
  )
}

const emptyResults: Omit<SearchResults, 'isLoading' | 'filter'> = {
  hits: [],
  totalNrOfResults: 0,
  totalNrOfPages: 0,
  currentPage: INITIAL_PAGE,
  canLoadMore: false,
}

export const useSearchResults = (filter: SearchFilter) => {
  const { displayError } = useErrorHandling()
  const [searchResults, setSearchResults] = useState<SearchResults>({
    ...emptyResults,
    isLoading: false,
    filter,
  })

  const performSearch = useCallback(
    (pageToLoad: number = INITIAL_PAGE) => {
      const sameFilterAsBefore = isSameFilter(searchResults.filter, filter)
      if (searchResults.isLoading && sameFilterAsBefore) {
        return
      }
      if (isEmptyFilter(filter)) {
        if (!sameFilterAsBefore) {
          setSearchResults({
            ...emptyResults,
            isLoading: false,
            filter,
          })
        }
        // Do not peform search with empty results
        return
      }
      setSearchResults((previousResults) => ({
        ...(sameFilterAsBefore ? previousResults : emptyResults),
        isLoading: true,
        filter,
      }))
      typesenseClient
        .collections<TypesenseDocument>(typesenseCollection ?? '')
        .documents()
        .search(createSearchParameters(filter, pageToLoad))
        .then((results) => {
          setSearchResults((previousResults) => {
            const sameFilterAsBefore = isSameFilter(previousResults.filter, filter)
            if (!sameFilterAsBefore) {
              return previousResults
            }
            const previousHits = results.page > INITIAL_PAGE ? previousResults.hits : []
            const totalNrOfPages = Math.ceil(results.found / PAGE_SIZE)
            return {
              isLoading: false,
              hits: [...previousHits, ...(results.hits ?? [])],
              totalNrOfResults: results.found,
              totalNrOfPages,
              currentPage: results.page,
              canLoadMore: results.page < totalNrOfPages,
              filter,
            }
          })
        })
        .catch((error) => {
          displayError(error, 'Error retrieving search results', {
            location: 'useSearchResults.performSearch',
          })
          setSearchResults((results) => ({ ...results, isLoading: false }))
        })
    },
    [searchResults.isLoading, searchResults.filter, filter, displayError]
  )

  const loadMore = useCallback(() => {
    return performSearch(searchResults.currentPage + 1)
  }, [performSearch, searchResults.currentPage])

  const refresh = useCallback(() => {
    return performSearch(INITIAL_PAGE)
  }, [performSearch])

  // Reset search on filter changes
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return {
    searchResults,
    loadMore,
    refresh,
  }
}
