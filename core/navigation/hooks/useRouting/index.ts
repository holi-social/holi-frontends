import { useCallback } from 'react'

import { getActionFromState, getStateFromPath } from '@react-navigation/core'
import { type NavigationState, StackActions, useLinkTo, useNavigation } from '@react-navigation/native'

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
    async (routeName: string) => {
      const state = getStateFromPath(routeName, linkingConfig)
      const action = state ? getActionFromState(state) : null

      if (!action) {
        linkTo(routeName)
        return false
      }

      switch (action.type) {
        case 'NAVIGATE': {
          const { name, params } = action.payload
          name ? dispatch(StackActions.replace(name, params)) : dispatch(action)
          break
        }
        case 'RESET': {
          // We need to get `name` and `params` from 'RESET' action to make correct replacement
          const { index = -1, routes } = (action.payload ?? {}) as NavigationState
          const { name, params } = routes?.[index]?.state?.routes?.[0] ?? {}
          name ? dispatch(StackActions.replace(name, params)) : dispatch(action)
          break
        }
        case 'GO_BACK':
        case 'SET_PARAMS':
          dispatch(action)
          break
        case undefined:
        default:
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          reset(state as any)
      }

      return true
    },
    [dispatch, linkTo, reset]
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
