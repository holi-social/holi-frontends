import { useCallback } from 'react'

import { getActionFromState, getStateFromPath } from '@react-navigation/core'
import { StackActions, useLinkTo, useNavigation } from '@react-navigation/native'

import { setPathname } from '@holi/core/navigation/hooks/usePathname'
import type { RoutingState } from '@holi/core/navigation/hooks/useRouting/types'
import linkingConfig from '@holi/mobile/navigation/linkingConfig'

const useRouting = (): RoutingState => {
  const linkTo = useLinkTo()
  const { canGoBack, goBack, dispatch, reset, setParams: setNavParams } = useNavigation()
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

  // based on https://github.com/react-navigation/react-navigation/discussions/10517
  const replaceRoute = useCallback(
    (routeName: string) => {
      const state = getStateFromPath(routeName, linkingConfig)
      if (state) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const action: any = getActionFromState(state)
        if (action) {
          const { name, params } = action?.payload || {}

          if (name) {
            dispatch(StackActions.replace(name, params))
          } else {
            dispatch(action)
          }
        } else {
          reset(state)
        }
      } else {
        linkTo(routeName)
      }
      return Promise.resolve(true)
    },
    [dispatch, linkTo, reset]
  )

  return {
    navigate,
    navigateBack,
    replaceRoute,
    setParams,
  }
}

export default useRouting
