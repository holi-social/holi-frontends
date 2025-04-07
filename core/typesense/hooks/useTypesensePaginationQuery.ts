import { logError } from '@holi/core/errors/helpers'
import { createTypesenseClient } from '@holi/core/typesense/helpers/createTypesenseClient'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { useCallback, useEffect, useState } from 'react'
import type { SearchParams, SearchResponseHit } from 'typesense/lib/Typesense/Documents'

// TODO create global Typesense client instance
const typesenseClient = createTypesenseClient()

const INITIAL_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export interface UseTypesensePaginationQueryOptions {
  parameters: SearchParams
  onError?: (error: Error) => void
}

interface TypesensePaginationState {
  isLoading: boolean
  data: SearchResponseHit<TypesenseDocument>[]
  totalResults: number
  canFetchMore: boolean
  currentPage: number
}

export interface UseTypesensePaginationQueryHook {
  isFetchingMore: boolean
  state: TypesensePaginationState
  fetchNextPage: () => Promise<void>
  refetch: () => Promise<void>
}

export const useTypesensePaginationQuery = ({
  parameters,
  onError,
}: UseTypesensePaginationQueryOptions): UseTypesensePaginationQueryHook => {
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  // Full result in one state to control rerenderings
  const [state, setState] = useState<TypesensePaginationState>({
    isLoading: false,
    data: [],
    totalResults: 0,
    currentPage: INITIAL_PAGE,
    canFetchMore: false,
  })

  const fetchPage = useCallback(
    async (pageNumber: number) => {
      // TODO(SF) necessary to compare prev & current params?
      if (state.isLoading) {
        return
      }
      setState((previousResults) => ({
        ...previousResults,
        isLoading: true,
      }))
      return typesenseClient
        .search({
          q: '*',
          per_page: DEFAULT_PAGE_SIZE,
          ...parameters,
          page: pageNumber,
        })
        .then((results) => {
          setState((previousResults) => {
            const previousData = results.page > INITIAL_PAGE ? previousResults.data : []
            return {
              isLoading: false,
              data: [...previousData, ...(results.hits ?? [])],
              totalResults: results.found,
              currentPage: results.page,
              canFetchMore: results.page < Math.ceil(results.found / (parameters.per_page ?? DEFAULT_PAGE_SIZE)),
            }
          })
        })
        .catch((error) => {
          if (onError) {
            onError(error)
          } else {
            logError(error, 'Failed to fetch single document', {
              location: 'useSingleTypesenseDocumentQuery',
            })
          }
          setState((previousResults) => ({
            ...previousResults,
            isLoading: false,
          }))
        })
    },
    [onError, parameters, state.isLoading]
  )
  const fetchNextPage = useCallback(async () => {
    setIsFetchingMore(true)
    return fetchPage(state.currentPage + 1).finally(() => setIsFetchingMore(false))
  }, [fetchPage, state.currentPage])

  const refetch = useCallback(() => {
    return fetchPage(INITIAL_PAGE)
  }, [fetchPage])

  useEffect(() => {
    refetch()
    // Only trigger if parameters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters])

  return {
    state,
    isFetchingMore,
    fetchNextPage,
    refetch,
  }
}
