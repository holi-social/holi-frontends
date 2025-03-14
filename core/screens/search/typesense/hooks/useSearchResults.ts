import {
  createSearchParameters,
  INITIAL_PAGE,
  PAGE_SIZE,
} from '@holi/core/screens/search/typesense/helpers/createSearchParameters'
import { createTypesenseClient } from '@holi/core/screens/search/typesense/helpers/createTypesenseClient'
import type { SearchFilter, SearchHitData, SearchResultInfo } from '@holi/core/screens/search/typesense/types'
import { useCallback, useEffect, useState } from 'react'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'

const typesenseClient = createTypesenseClient()

export const useSearchResults = (filter: SearchFilter) => {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResponseHit<SearchHitData>[]>([])
  // const [page, setPage] = useState(INITIAL_PAGE)
  // const [canLoadMore, setCanLoadMore] = useState(false)
  const [searchResultInfo, setSearchResultInfo] = useState<SearchResultInfo>({
    totalNrOfResults: 0,
    totalNrOfPages: 0,
    currentPage: INITIAL_PAGE,
    canLoadMore: false,
  })

  const performSearch = useCallback(
    (pageToLoad: number = INITIAL_PAGE) => {
      if (isLoading) {
        return
      }
      setIsLoading(true)
      typesenseClient
        .search(createSearchParameters(filter, pageToLoad))
        .then((searchResults) => {
          const totalNrOfPages = Math.ceil(searchResults.found / PAGE_SIZE)
          setSearchResultInfo({
            totalNrOfResults: searchResults.found,
            totalNrOfPages,
            currentPage: searchResults.page,
            canLoadMore: searchResults.page < totalNrOfPages,
          })
          setResults((previousResults) => [
            // Append to previous results if not the first page
            ...(searchResults.page > INITIAL_PAGE ? previousResults : []),
            ...(searchResults.hits ?? []),
          ])
        })
        // TODO(SF) error handling
        .finally(() => setIsLoading(false))
    },
    [filter, isLoading]
  )

  const loadMore = useCallback(() => {
    return performSearch(searchResultInfo.currentPage + 1)
  }, [performSearch, searchResultInfo.currentPage])

  const refresh = useCallback(() => {
    return performSearch(INITIAL_PAGE)
  }, [performSearch])

  // Reset search on filter changes
  useEffect(() => {
    refresh()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  return {
    isLoading,
    results,
    searchResultInfo,
    loadMore,
    refresh,
  }
}
