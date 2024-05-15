import { useCallback } from 'react'

import { useIsFocused } from '@holi/core/helpers/useIsFocused'

export const useCallWhenCurrentScreenIsActive = (func: CallableFunction) => {
  const isFocused = useIsFocused()

  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => {
      if (isFocused) func(...args)
    },
    [func, isFocused]
  )
}
