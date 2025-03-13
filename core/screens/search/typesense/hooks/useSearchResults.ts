import {
  createSearchParameters,
  INITIAL_PAGE,
  PAGE_SIZE,
} from '@holi/core/screens/search/typesense/helpers/createSearchParameters'
import { createTypesenseClient } from '@holi/core/screens/search/typesense/helpers/createTypesenseClient'
import type { SearchFilter, SearchHitData } from '@holi/core/screens/search/typesense/types'
import { useCallback, useEffect, useState } from 'react'
import type { SearchResponseHit } from 'typesense/lib/Typesense/Documents'

const typesenseClient = createTypesenseClient()

export const useSearchResults = (filter: SearchFilter) => {
  const [isLoading, setIsLoading] = useState(false)
  const [results, setResults] = useState<SearchResponseHit<SearchHitData>[]>([])
  const [page, setPage] = useState(INITIAL_PAGE)
  const [canLoadMore, setCanLoadMore] = useState(false)

  const performSearch = useCallback(
    (pageToLoad: number = INITIAL_PAGE) => {
      if (isLoading) {
        return
      }
      setIsLoading(true)
      typesenseClient
        .search(createSearchParameters(filter, pageToLoad))
        .then((searchResults) => {
          const pageSize = searchResults.hits?.length ?? 0
          setPage(searchResults.page)
          setCanLoadMore(pageSize === PAGE_SIZE && searchResults.found > PAGE_SIZE * searchResults.page)
          setResults((previousResults) => [
            // Append to previous results if there are any
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
    return performSearch(page + 1)
  }, [performSearch, page])

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
    canLoadMore,
    loadMore,
    refresh,
  }
}
