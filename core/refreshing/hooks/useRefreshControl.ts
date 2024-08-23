import { useCallback, useMemo, useState } from 'react'

import { logError } from '@holi/core/errors/helpers'
import { RefreshContextType, RefreshHandler } from '@holi/core/refreshing/hooks/useRefreshContext'

export const useRefreshControl = (): RefreshContextType => {
  const [refreshing, setRefreshing] = useState(false)
  const [refreshHandlers] = useState<RefreshHandler[]>([])

  const registerRefreshHandler = useCallback(
    (handler: RefreshHandler) => {
      // Mutating in-place to not trigger rerenders
      refreshHandlers.push(handler)
      // Return callback to remove handler (e.g. during unmount)
      return () => {
        const index = refreshHandlers.indexOf(handler)
        refreshHandlers.splice(index, 1)
      }
    },
    [refreshHandlers]
  )

  const onRefresh = useCallback(async () => {
    setRefreshing(true)
    return Promise.all(refreshHandlers.map((handler) => handler()))
      .catch((error) => logError(error, 'Error during refresh', { location: 'useRefreshControl.onRefresh' }))
      .finally(() => setRefreshing(false))
  }, [refreshHandlers])

  const refreshControlProps = useMemo(
    () => ({
      refreshing,
      onRefresh,
    }),
    [refreshing, onRefresh]
  )
  return {
    refreshControlProps,
    registerRefreshHandler,
  }
}
