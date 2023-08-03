import { useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { onScreenScrollY, useMobileScrollListener } from '@holi/core/helpers'
import { useCallWhenCurrentScreenIsActive } from '@holi/core/helpers/useCallWhenCurrentScreenIsActive'

export const useMobileScrollHandler = (onScroll?: (event: NativeSyntheticEvent<NativeScrollEvent>) => void) => {
  const globalScrollListener = useMobileScrollListener()
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
