import { useCallback } from 'react'

import { type RefreshHandler, useRefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'
import { useFocusEffect } from 'expo-router'

export const useOnRefresh = (callback?: RefreshHandler) => {
  const { registerRefreshHandler } = useRefreshContext()

  // Only register handlers for currently focused screen
  const onFocus = useCallback(() => {
    if (callback) {
      // Deregister callback when unfocused again
      return registerRefreshHandler?.(callback)
    }
  }, [callback, registerRefreshHandler])

  useFocusEffect(onFocus)

  return callback
}
