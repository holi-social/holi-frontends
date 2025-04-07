import { logError } from '@holi/core/errors/helpers'
import { createTypesenseClient } from '@holi/core/typesense/helpers/createTypesenseClient'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { useCallback, useEffect, useState } from 'react'
import type { SearchParams, SearchResponseHit } from 'typesense/lib/Typesense/Documents'
import isEqual from 'lodash/isEqual'

// TODO create global Typesense client instance
const typesenseClient = createTypesenseClient()

const INITIAL_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export interface UseTypesensePaginationQueryOptions {
  parameters: SearchParams
  onError?: (error: Error) => void
  skip?: boolean
}

interface TypesensePaginationState {
  isLoading: boolean
  data: SearchResponseHit<TypesenseDocument>[]
  totalResults: number
  canFetchMore: boolean
  currentPage: number
  parameters: SearchParams
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
  skip,
}: UseTypesensePaginationQueryOptions): UseTypesensePaginationQueryHook => {
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  // Full result in one state to control rerenderings
  const [state, setState] = useState<TypesensePaginationState>({
    isLoading: false,
    data: [],
    totalResults: 0,
    currentPage: INITIAL_PAGE,
    canFetchMore: false,
    parameters,
  })

  const fetchPage = useCallback(
    async (pageNumber: number) => {
      const sameParametersAsBefore = isEqual(state.parameters, parameters)

      if (state.isLoading && sameParametersAsBefore) {
        return
      }
      setState((previousResults) => ({
        ...previousResults,
        isLoading: true,
        parameters,
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
            const sameParametersAsBefore = isEqual(previousResults.parameters, parameters)
            if (!sameParametersAsBefore) {
              return previousResults
            }
            const previousData = results.page > INITIAL_PAGE ? previousResults.data : []
            return {
              isLoading: false,
              data: [...previousData, ...(results.hits ?? [])],
              totalResults: results.found,
              currentPage: results.page,
              canFetchMore: results.page < Math.ceil(results.found / (parameters.per_page ?? DEFAULT_PAGE_SIZE)),
              parameters,
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
    [onError, parameters, state.isLoading, state.parameters]
  )
  const fetchNextPage = useCallback(async () => {
    setIsFetchingMore(true)
    return fetchPage(state.currentPage + 1).finally(() => setIsFetchingMore(false))
  }, [fetchPage, state.currentPage])

  const refetch = useCallback(() => {
    return fetchPage(INITIAL_PAGE)
  }, [fetchPage])

  useEffect(() => {
    if (!skip) {
      refetch()
    }
    // Only trigger if parameters change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters, skip])

  return {
    state,
    isFetchingMore,
    fetchNextPage,
    refetch,
  }
}
