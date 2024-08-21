import { useCallback } from 'react'

import { useFocusEffect } from '@react-navigation/native'

import { RefreshHandler, useRefreshContext } from '@holi/core/refreshing/hooks/useRefreshContext'

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
}
