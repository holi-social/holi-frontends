import { useCallback } from 'react'

import { getActionFromState, getStateFromPath } from '@react-navigation/core'
import { StackActions, useLinkTo, useNavigation } from '@react-navigation/native'

import { useNavigationContext } from '@holi/core/navigation/hooks/NavigationContextProvider/NavigationContext'
import { UseRouting, navigateOptions } from '@holi/core/navigation/hooks/useRouting/types'
import { navigationRef } from '@holi/core/navigation/hooks/useUnifiedNavigation'
import linkingConfig from '@holi/mobile/navigation/linkingConfig'

const useRouting: UseRouting = () => {
  const { pathname, setPathname, redirectPath, setRedirectAfterLogin, clearRedirectAfterLogin } = useNavigationContext()
  const linkTo = useLinkTo()
  const navigation = useNavigation()

  const navigate = useCallback(
    (routeName: string, options?: navigateOptions) => {
      console.log('[useRouting] navigate to', routeName)
      if (options?.redirectAfterLogin) {
        setRedirectAfterLogin(pathname)
        console.log('[useRouting] set redirect to ', options.redirectAfterLogin, '(pathname: ', pathname, ')')
      }
      setPathname(routeName)
      return linkTo(routeName)
    },
    [pathname, setPathname, setRedirectAfterLogin, linkTo]
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

  const redirect = useCallback(() => {
    // wait until navigation is reinitialized (after login)
    const intRef = setInterval(() => {
      if (navigationRef.isReady()) {
        clearInterval(intRef)
        performRedirect(redirectPath, clearRedirectAfterLogin, navigate)
      }
    }, 200)
  }, [redirectPath, clearRedirectAfterLogin, navigate])

  const performRedirect = (
    url: string | null,
    clearRedirectAfterLogin: () => void,
    navigate: (url: string) => void
  ) => {
    if (url && url !== '/') {
      clearRedirectAfterLogin()
      navigate(url)
    }
  }

  return {
    navigate,
    navigateBack,
    replaceRoute,
    redirect,
    pathname,
  }
}

export default useRouting
