import { useCallback, useLayoutEffect } from 'react'

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

  const navigationRefOptions = (navigationRef?.getCurrentOptions() as NavigationCustomOptions)?.navigationCustomOptions
    ?.footerShown

  useLayoutEffect(() => {
    if (navigationRef.isReady()) {
      if (context.options.navigationCustomOptions?.footerShown !== navigationRefOptions) {
        setUnifiedOptions((currentOptions: NavigationCustomOptions) => {
          console.log('navigationRefOptions: ', navigationRefOptions)
          return {
            ...currentOptions,
            navigationCustomOptions: {
              ...(currentOptions.navigationCustomOptions || {}),
              footerShown: navigationRefOptions,
            },
          }
        })
      }
    }
  }, [navigationRefOptions, context.options.navigationCustomOptions?.footerShown, setUnifiedOptions])

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
