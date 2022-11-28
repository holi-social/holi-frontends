import { useCallback } from 'react'

import { getActionFromState, getStateFromPath } from '@react-navigation/core'
import { StackActions, useLinkTo, useNavigation } from '@react-navigation/native'

import { useNavigationContext } from '@holi/core/navigation/hooks/NavigationContextProvider/NavigationContext'
import { UseRouting } from '@holi/core/navigation/hooks/useRouting/types'
import linkingConfig from '@holi/mobile/navigation/linkingConfig'

const useRouting: UseRouting = () => {
  const { pathname, setPathname } = useNavigationContext()
  const linkTo = useLinkTo()
  const navigation = useNavigation()

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
        setPathname(fallbackRouteName)
      } else {
        navigate(fallbackRouteName)
      }
    },
    [navigation, navigate, setPathname]
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
    pathname,
  }
}

export default useRouting
