import {
  ApolloQueryResult,
  DocumentNode,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
  useQuery,
} from '@apollo/client'
import { useCallback, useState } from 'react'

import { Paged } from '@holi/core/types'

type PagedResponse<T, QueryName extends string> = {
  [P in QueryName]: Paged<T>
}

export interface PaginationQueryHookOptions extends QueryHookOptions {
  pageSize: number
  queryName: string
}

interface PaginationQueryResult<TData, TFetchData> extends Partial<QueryResult<TData>> {
  data: TData
  isFetchingMore: boolean
  totalResults: number
  canFetchMore: boolean
  fetchNextPage: () => Promise<TFetchData>
}

function usePaginationQuery<TData>(
  query: DocumentNode | TypedDocumentNode<PagedResponse<TData, string>>,
  options: PaginationQueryHookOptions
): PaginationQueryResult<TData[], ApolloQueryResult<PagedResponse<TData, string>>> {
  const { pageSize, queryName, variables, ...remainingOptions } = options
  const [isFetchingMore, setIsFetchingMore] = useState(false)

  const {
    loading,
    data: pagedData,
    error,
    fetchMore,
  } = useQuery<PagedResponse<TData, string>>(query, {
    variables: {
      ...variables,
      limit: pageSize,
      offset: 0,
    },
    ...remainingOptions,
  })

  const { data = [], totalResults = 0 } = (pagedData?.[queryName] || {}) as Paged<TData>

  const canFetchMore = data.length < totalResults

  const memoizedFetchMore = useCallback(async () => {
    setIsFetchingMore(true)
    return fetchMore({
      variables: {
        offset: data.length,
      },
    }).finally(() => setIsFetchingMore(false))
  }, [fetchMore, data.length, setIsFetchingMore])

  return {
    loading,
    data,
    error,
    totalResults,
    isFetchingMore,
    canFetchMore,
    fetchNextPage: memoizedFetchMore,
  }
}

export default usePaginationQuery
