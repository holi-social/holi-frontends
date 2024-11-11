import { DocumentNode, OperationVariables, QueryHookOptions, TypedDocumentNode, useApolloClient } from '@apollo/client'
import { useCallback, useRef, useState } from 'react'
import { Subscription } from 'zen-observable-ts'

type ReturnValue<TData, TVariables extends OperationVariables> = [
  (options: QueryHookOptions<TData, TVariables>) => void,
  { data: TData | undefined; error: Error | null; loading: boolean; abort: () => void },
]

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useLazyAbortableQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>
): ReturnValue<TData, TVariables> {
  const [data, setData] = useState<TData>()
  const [error, setError] = useState<Error | null>(null)
  const [loading, setLoading] = useState(false)

  const subscriptionRef = useRef<Subscription | null>(null)
  const abort = useCallback(() => {
    subscriptionRef.current?.unsubscribe()
    setData(undefined)
    setError(null)
  }, [])

  const apolloClient = useApolloClient()

  const fetchQuery = useCallback(
    (options: QueryHookOptions<TData, TVariables>) => {
      // abort previous query
      abort()

      setLoading(true)
      const watchedQuery = apolloClient.watchQuery({
        query,
        ...options,
        fetchPolicy: options?.fetchPolicy || 'cache-and-network',
      })

      subscriptionRef.current = watchedQuery.subscribe({
        next(result) {
          if (!result.partial) {
            setData(result.data)
            setError(null)
            setLoading(false)
          }
        },
        error(err) {
          setError(err)
          setLoading(false)
        },
        complete() {
          setLoading(false)
        },
      })
    },
    [abort, apolloClient, query]
  )

  return [fetchQuery, { data, error, loading, abort }]
}
