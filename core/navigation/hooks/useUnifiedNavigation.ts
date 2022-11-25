import { useCallback } from 'react'

import { useNavigation } from '@react-navigation/native'

import { useNavigationContext } from '@holi/core/navigation/hooks/NavigationContextProvider'
import useRouting from '@holi/core/navigation/hooks/useRouting'
import { NativeStackNavigationCustomHeaderOptions } from '@holi/mobile/navigation/HeaderAnimated'

export const useUnifiedNavigation = () => {
  const { setOptions: setUnifiedOptions, ...context } = useNavigationContext()
  const { navigate, navigateBack, replaceRoute, query } = useRouting()
  const { setOptions: setNativeOptions } = useNavigation()

  const setOptions = useCallback(
    (options: NativeStackNavigationCustomHeaderOptions) => {
      setNativeOptions?.(options)
      setUnifiedOptions(options)
    },
    [setNativeOptions, setUnifiedOptions]
  )

  return {
    navigate,
    navigateBack,
    replaceRoute,
    query,
    ...context,
    setOptions,
  }
}
