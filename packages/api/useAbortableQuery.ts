import type { DocumentNode, OperationVariables, TypedDocumentNode } from '@apollo/client'
import { useApolloClient, type useQuery } from '@apollo/client/react'
import { useEffect, useState } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function useAbortableQuery<TData = any, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options: useQuery.Options<TData, TVariables>,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  dependencies?: any
) {
  const [data, setData] = useState<TData>()
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  const apolloClient = useApolloClient()

  useEffect(() => {
    setLoading(true)
    const watchedQuery = apolloClient.watchQuery({
      query,
      ...options,
      fetchPolicy: options?.fetchPolicy || 'cache-and-network',
    })

    const sub = watchedQuery.subscribe({
      next(x) {
        if (x.dataState === 'complete') {
          setData(x.data)
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

    return () => {
      sub.unsubscribe()
    }
    // aborting and restarting query could be handled only through `dependencies`
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [...[dependencies].flat()])

  return { data, error, loading }
}
