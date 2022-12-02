import { useCallback } from 'react'

import { useNavigation } from '@react-navigation/native'
import { createNavigationContainerRef } from '@react-navigation/native'

import { useNavigationContext } from '@holi/core/navigation/hooks/NavigationContextProvider'
import type { NavigationCustomOptions } from '@holi/core/navigation/hooks/NavigationContextProvider/NavigationContext'
import useRouting from '@holi/core/navigation/hooks/useRouting'

export const navigationRef = createNavigationContainerRef()

export const useUnifiedNavigation = () => {
  const { setOptions: setUnifiedOptions, ...context } = useNavigationContext()
  const { navigate, navigateBack, replaceRoute } = useRouting()
  const { setOptions: setNativeOptions } = useNavigation()

  if (navigationRef.isReady()) {
    if (typeof context.options.navigationCustomOptions?.footerShown === 'undefined') {
      if (!context.options.navigationCustomOptions) context.options.navigationCustomOptions = {}
      context.options.navigationCustomOptions!.footerShown = (
        navigationRef?.getCurrentOptions() as NavigationCustomOptions
      )?.navigationCustomOptions?.footerShown
    }
  }

  const setOptions = useCallback(
    (options: NavigationCustomOptions) => {
      setNativeOptions?.(options)
      setUnifiedOptions(options)
    },
    [setNativeOptions, setUnifiedOptions]
  )

  return {
    navigate,
    navigateBack,
    replaceRoute,
    ...context,
    setOptions,
  }
}
