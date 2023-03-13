import { useCallback } from 'react'

import { useNavigation } from '@react-navigation/native'

export const useCallWhenCurrentScreenIsActive = (func: CallableFunction) => {
  const { isFocused } = useNavigation()

  return useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (...args: any[]) => {
      if (isFocused()) func(...args)
    },
    [func, isFocused]
  )
}
