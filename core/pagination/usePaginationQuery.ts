import type { ErrorLike, DocumentNode, TypedDocumentNode } from '@apollo/client'
import { useQuery } from '@apollo/client/react'
import at from 'lodash.at'
import { useCallback, useEffect, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import type { Paged } from '@holi/core/types'

type PagedResponse<T, QueryName extends string> = {
  [P in QueryName]: Paged<T>
}

export interface PaginationQueryHookOptions extends useQuery.Options {
  pageSize: number
  queryPath: string
  onError?: (error: ErrorLike) => void
}

function usePaginationQuery<TData>(
  query: DocumentNode | TypedDocumentNode<PagedResponse<TData, string>>,
  options: PaginationQueryHookOptions
) {
  const { pageSize, queryPath, variables, onError, ...remainingOptions } = options
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const {
    loading,
    data: pagedData,
    error,
    fetchMore,
    refetch,
  } = useQuery<PagedResponse<TData, string>>(query, {
    variables: {
      ...variables,
      limit: pageSize,
      offset: 0,
    },
    ...remainingOptions,
  })

  const { data = [], totalResults = 0 } = at<Paged<TData>>(pagedData, queryPath)[0] ?? {}

  const initialLoading = loading && !pagedData
  const canFetchMore = !initialLoading && data.length < totalResults

  useEffect(() => {
    if (error) {
      onError?.(error)
    }
  }, [error, onError])

  const fetchNextPage = useCallback(async () => {
    if (isFetchingMore) {
      return
    }
    setIsFetchingMore(true)
    return fetchMore({
      variables: {
        offset: data.length,
      },
    })
      .catch((error) =>
        logError(error, 'Failed to fetch more', {
          location: 'usePaginationQuery.memoizedFetchMore',
        })
      )
      .finally(() => setIsFetchingMore(false))
  }, [isFetchingMore, fetchMore, data.length])

  return {
    loading: initialLoading,
    data,
    error,
    totalResults,
    isFetchingMore,
    canFetchMore,
    fetchNextPage,
    refetch,
  }
}

export type UsePaginationQueryResult<T> = ReturnType<typeof usePaginationQuery<T>>

export default usePaginationQuery
