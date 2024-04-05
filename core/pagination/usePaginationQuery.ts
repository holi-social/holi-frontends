import { DocumentNode, QueryHookOptions, TypedDocumentNode, useQuery } from '@apollo/client'
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

function usePaginationQuery<TData>(
  query: DocumentNode | TypedDocumentNode<PagedResponse<TData, string>>,
  options: PaginationQueryHookOptions
) {
  const { pageSize, queryPath, variables, ...remainingOptions } = options
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
    onCompleted: (data) => {
      setIsFetchingMore(false)
      if (remainingOptions.onCompleted) {
        remainingOptions.onCompleted(data)
      }
    },
  })

  const { data = [], totalResults = 0 } = at<Paged<TData>>(pagedData, queryPath)[0] || {}

  const initialLoading = loading && !pagedData
  const canFetchMore = !initialLoading && data.length < totalResults

  const fetchNextPage = useCallback(async () => {
    if (isFetchingMore) {
      return
    }
    setIsFetchingMore(true)
    return fetchMore({
      variables: {
        offset: data.length,
      },
    }).catch((error) =>
      logError(error, 'Failed to fetch more', {
        location: 'usePaginationQuery.memoizedFetchMore',
      })
    )
  }, [isFetchingMore, fetchMore, data.length])

  return {
    loading: initialLoading,
    data,
    error,
    totalResults,
    isFetchingMore,
    canFetchMore,
    fetchNextPage,
  }
}

export type UsePaginationQueryResult<T> = ReturnType<typeof usePaginationQuery<T>>

export default usePaginationQuery
