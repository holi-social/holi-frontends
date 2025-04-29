import { logError } from '@holi/core/errors/helpers'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { useCallback, useEffect, useState } from 'react'
import type { SearchParams, SearchResponseHit } from 'typesense/lib/Typesense/Documents'
import isEqual from 'lodash/isEqual'
import { useTypesenseClient } from '@holi/core/typesense/provider/TypesenseClientProvider'

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
    isLoading: !skip,
    data: [],
    totalResults: 0,
    currentPage: INITIAL_PAGE,
    canFetchMore: false,
    parameters: {},
  })
  const { client } = useTypesenseClient()

  const fetchPage = useCallback(
    async (pageNumber: number) => {
      const sameParametersAsBefore = isEqual(state.parameters, parameters)

      if ((state.isLoading && sameParametersAsBefore) || skip) {
        return
      }
      setState((previousResults) => ({
        ...previousResults,
        isLoading: true,
        parameters,
      }))
      return client
        .multiSearch([
          {
            q: '*',
            per_page: DEFAULT_PAGE_SIZE,
            exclude_fields: 'embedding,similarity_embedding,topics_skills_embedding_v2',
            ...parameters,
            page: pageNumber,
          },
        ])
        .then((multiSearchResults) => {
          setState((previousResults) => {
            const sameParametersAsBefore = isEqual(previousResults.parameters, parameters)
            if (!sameParametersAsBefore || !multiSearchResults.results.length) {
              return previousResults
            }
            const results = multiSearchResults.results[0]
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
            logError(error, 'Failed to fetch documents', {
              location: 'useTypesensePaginationQuery',
            })
          }
          setState((previousResults) => ({
            ...previousResults,
            isLoading: false,
          }))
        })
    },
    [client, onError, parameters, state.isLoading, state.parameters, skip]
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
    // Only trigger if parameters or skip flag change
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parameters, skip])

  return {
    state,
    isFetchingMore,
    fetchNextPage,
    refetch,
  }
}
