import { useCallback, useState } from 'react'

export const useOnRefresh = <P, R>(callback: (...args: P[]) => Promise<R>) => {
  const [refreshing, setRefreshing] = useState(false)

  return {
    refreshing,
    onRefresh: useCallback(
      async (...args: P[]) => {
        setRefreshing(true)
        await callback(...args)
        setRefreshing(false)
      },
      [callback]
    ),
  }
}
