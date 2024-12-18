import { useCallback } from 'react'

import { useLinkTo, useNavigation } from '@react-navigation/native'

import { setPathname } from '@holi/core/navigation/hooks/usePathname'
import type { RoutingState } from '@holi/core/navigation/hooks/useRouting/types'

const useRouting = (): RoutingState => {
  const linkTo = useLinkTo()
  const { canGoBack, goBack, setParams: setNavParams } = useNavigation()
  const setParams = setNavParams as unknown as (params: Record<string, unknown>) => void

  const navigate = useCallback(
    (path: string) => {
      setPathname(path)
      return linkTo(path)
    },
    [linkTo]
  )

  const navigateBack = useCallback(
    (pathName = '/') => {
      if (canGoBack()) {
        goBack()
        setPathname(pathName)
      } else {
        navigate(pathName)
      }
    },
    [canGoBack, goBack, navigate]
  )

  const replaceRoute = useCallback(
    async (routeName: string) => {
      navigateBack()
      navigate(routeName) // Will do nothing if equal to previous route
      return true
    },
    [navigate, navigateBack]
  )

  return {
    navigate,
    navigateBack,
    replaceRoute,
    replaceHistory: replaceRoute,
    setParams,
  }
}

export default useRouting
