import { useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { onScreenScrollY, useGlobalScrollListener } from '@holi/core/helpers'
import { useCallWhenCurrentScreenIsActive } from '@holi/core/helpers/useCallWhenCurrentScreenIsActive'

export const useScrollHandler = (onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void) => {
  const globalScrollListener = useGlobalScrollListener()
  const onScreenScrollListener = useCallWhenCurrentScreenIsActive(globalScrollListener)
  const onScreenScrollHeader = useCallWhenCurrentScreenIsActive(onScreenScrollY)

  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll?.(event)
      onScreenScrollListener(event)
      onScreenScrollHeader(event)
    },
    [onScreenScrollListener, onScreenScrollHeader, onScroll]
  )
}
