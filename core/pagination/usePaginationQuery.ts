import {
  ApolloQueryResult,
  DocumentNode,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client'
import at from 'lodash.at'
import { useCallback, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { Paged } from '@holi/core/types'

type PagedResponse<T, QueryName extends string> = {
  [P in QueryName]: Paged<T>
}

export interface PaginationQueryHookOptions extends QueryHookOptions {
  pageSize: number
  queryPath: string
}

interface PaginationQueryResult<TData, TFetchData> extends Partial<QueryResult<TData>> {
  data: TData
  isFetchingMore: boolean
  totalResults: number
  canFetchMore: boolean
  fetchNextPage: () => Promise<TFetchData | void>
  refresh: () => void
}

function usePaginationQuery<TData>(
  query: DocumentNode | TypedDocumentNode<PagedResponse<TData, string>>,
  options: PaginationQueryHookOptions
): PaginationQueryResult<TData[], ApolloQueryResult<PagedResponse<TData, string>>> {
  const { pageSize, queryPath, variables, ...remainingOptions } = options
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [offset, setOffset] = useState(0)

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
      offset: offset,
    },
    ...remainingOptions,
    onCompleted: (data) => {
      setIsFetchingMore(false)
      if (remainingOptions.onCompleted) {
        remainingOptions.onCompleted(data)
      }
    },
  })

  const { data = [], totalResults = 0 } = at<Paged<TData>>(pagedData, queryPath)[0] || {}

  const canFetchMore = !loading && data.length < totalResults

  const memoizedFetchMore = useCallback(async () => {
    if (isFetchingMore) {
      return
    }
    setIsFetchingMore(true)
    setOffset(data.length)
    return fetchMore({
      variables: {
        offset: offset,
      },
    }).catch((error) =>
      logError(error, 'Failed to fetch more', {
        location: 'usePaginationQuery.memoizedFetchMore',
      })
    )
  }, [isFetchingMore, fetchMore, data.length, offset])

  const refresh = useCallback(() => {
    // Add this block
    setOffset(0)
    refetch()
  }, [refetch])

  return {
    // Sometimes there is a delay between setting loading to false and filling the pagedData/error
    loading: loading || (!pagedData && !error),
    data,
    error,
    totalResults,
    isFetchingMore,
    canFetchMore,
    fetchNextPage: memoizedFetchMore,
    refresh,
  }
}

export default usePaginationQuery
