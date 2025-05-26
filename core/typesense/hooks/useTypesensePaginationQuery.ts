import { useQuery } from '@apollo/client'
import { Typesense_MultiSearchDocument } from '@holi/api/graphql/graphql-codegen'
import { logError } from '@holi/core/errors/helpers'
import type { TypesenseDocument } from '@holi/core/typesense/types'
import { useCallback, useEffect, useMemo, useState } from 'react'
import type { SearchParams, SearchResponseHit } from 'typesense/lib/Typesense/Documents'

const INITIAL_PAGE = 1
const DEFAULT_PAGE_SIZE = 10

export interface UseTypesensePaginationQueryOptions {
  parameters: SearchParams
  onError?: (error: Error) => void
  skip?: boolean
}

export interface TypesensePaginationState {
  isLoading: boolean
  hits: SearchResponseHit<TypesenseDocument>[]
  totalNrOfPages: number
  totalResults: number
  canFetchMore: boolean
  currentPage: number
  parameters: SearchParams
  error?: Error
}

export interface UseTypesensePaginationQueryHook {
  isFetchingMore: boolean
  state: TypesensePaginationState
  fetchNextPage: () => Promise<void>
  refetch: () => Promise<void>
}

const emptyState: Omit<TypesensePaginationState, 'parameters'> = {
  isLoading: false,
  hits: [],
  totalNrOfPages: 0,
  totalResults: 0,
  currentPage: 0,
  canFetchMore: false,
}

export const useTypesensePaginationQuery = ({
  parameters,
  onError,
  skip,
}: UseTypesensePaginationQueryOptions): UseTypesensePaginationQueryHook => {
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const searchParams = useMemo(
    () => ({
      q: '*',
      per_page: DEFAULT_PAGE_SIZE,
      exclude_fields: 'embedding,similarity_embedding,topics_skills_embedding_v2',
      ...parameters,
      page: INITIAL_PAGE,
    }),
    [parameters]
  )
  const {
    loading: isLoading,
    data,
    refetch: refetchResults,
    fetchMore,
    error,
  } = useQuery(Typesense_MultiSearchDocument, {
    variables: {
      input: {
        searches: [searchParams],
      },
    },
    skip,
  })

  // Full result in one state to control rerenderings
  const state = useMemo(() => {
    const resultList = data?.typesense_multiSearch?.results
    if (!resultList?.length) {
      if (skip || !error) {
        // Initial loading state
        return {
          ...emptyState,
          isLoading: !skip,
          parameters,
        }
      }
      return {
        ...emptyState,
        error: error ?? new Error('Error fetching results'),
        parameters,
      }
    } else {
      const results = resultList[0]
      if ('error' in results) {
        return {
          ...emptyState,
          error: results.error,
          parameters,
        }
      } else {
        const pageSize = parameters.per_page ?? DEFAULT_PAGE_SIZE
        const totalNrOfPages = Math.ceil(results.found / pageSize)
        const canFetchMore = results.found > pageSize * results.page

        return {
          isLoading,
          hits: results.hits,
          totalResults: results.found,
          totalNrOfPages,
          currentPage: results.page,
          canFetchMore,
          parameters,
        }
      }
    }
  }, [data?.typesense_multiSearch?.results, error, skip, parameters, isLoading])

  const fetchNextPage = useCallback(async () => {
    if (isFetchingMore) {
      return
    }
    setIsFetchingMore(true)
    await fetchMore({
      variables: {
        input: {
          searches: [
            {
              ...searchParams,
              page: state.currentPage + 1,
            },
          ],
        },
      },
    })
      .catch((error) =>
        logError(error, 'Failed to fetch more', {
          location: 'useTypesensePaginationQuery.fetchNextPage',
        })
      )
      .finally(() => setIsFetchingMore(false))
  }, [fetchMore, isFetchingMore, searchParams, state.currentPage])

  const refetch = useCallback(async () => {
    if (skip) {
      return
    }
    await refetchResults({
      input: {
        searches: [
          {
            ...searchParams,
            page: INITIAL_PAGE,
          },
        ],
      },
    })
  }, [refetchResults, searchParams, skip])

  useEffect(() => {
    if ('error' in state && state.error) {
      if (onError) {
        onError(state.error)
      } else {
        logError(state.error, 'Failed to fetch documents', {
          location: 'useTypesensePaginationQuery',
        })
      }
    }
  }, [onError, state])

  return {
    state,
    isFetchingMore,
    fetchNextPage,
    refetch,
  }
}
