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
        const action = getActionFromState(state)

        switch (action?.type) {
          case 'NAVIGATE': {
            const { name, params } = action.payload
            name ? dispatch(StackActions.replace(name, params)) : dispatch(action)
            break
          }
          case 'GO_BACK':
          case 'RESET':
          case 'SET_PARAMS':
            dispatch(action)
            break
          case undefined:
          default:
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            reset(state as any)
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
