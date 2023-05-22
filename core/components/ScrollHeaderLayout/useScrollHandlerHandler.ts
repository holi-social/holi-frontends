import { useCallback } from 'react'
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'

import { onScreenScrollY } from '@holi/core/helpers'
import { useCallWhenCurrentScreenIsActive } from '@holi/core/helpers/useCallWhenCurrentScreenIsActive'

export const useScrollHandlerHandler = (onScroll?: CallableFunction) => {
  const onScreenScrollHeader = useCallWhenCurrentScreenIsActive(onScreenScrollY)

  return useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      onScroll?.(event)
      onScreenScrollHeader(event)
    },
    [onScreenScrollHeader, onScroll]
  )
}
