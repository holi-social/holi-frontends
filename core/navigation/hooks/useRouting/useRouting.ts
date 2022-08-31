import { useCallback } from 'react'

import { getActionFromState, getStateFromPath } from '@react-navigation/core'
import { StackActions, useLinkTo, useNavigation } from '@react-navigation/native'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import { rootLinkingConfig } from '@holi/mobile/navigation/NavigationProvider'

import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const { setPathname, pathname } = useNavigationContext()
  const linkTo = useLinkTo()
  const navigation = useNavigation()
  const currentRoute = navigation.getState().routes[navigation.getState().index]

  const navigate = useCallback(
    (routeName: string) => {
      setPathname(routeName)
      return linkTo(routeName)
    },
    [setPathname, linkTo]
  )

  const navigateBack = useCallback(
    (fallbackRouteName = '/') => {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        navigate(fallbackRouteName)
      }
    },
    [navigation, navigate]
  )

  // based on https://github.com/react-navigation/react-navigation/discussions/10517
  const replaceRoute = useCallback(
    (routeName: string) => {
      const state = getStateFromPath(routeName, rootLinkingConfig.config)
      if (state) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const action: any = getActionFromState(state)
        if (action) {
          const { name, params } = action?.payload || {}

          if (name) {
            console.log(StackActions, name, params)
            navigation.dispatch(StackActions.replace(name, params))
          } else {
            navigation.dispatch(action)
          }
        } else {
          navigation.reset(state)
        }
      } else {
        linkTo(routeName)
      }
    },
    [navigation, linkTo]
  )

  return {
    navigate,
    navigateBack,
    replaceRoute,
    query: currentRoute.params as T,
    pathname,
  }
}

export default useRouting
