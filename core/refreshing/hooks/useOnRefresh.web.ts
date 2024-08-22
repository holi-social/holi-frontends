import { useEffect } from 'react'

import { RefreshHandler, useRefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'

export const useOnRefresh = (callback?: RefreshHandler) => {
  const { registerRefreshHandler } = useRefreshContext()

  useEffect(() => {
    if (callback) {
      // Deregister focus on onmount
      return registerRefreshHandler?.(callback)
    }
  }, [callback, registerRefreshHandler])

  return callback
}
