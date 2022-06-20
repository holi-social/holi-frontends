import { useLinkTo, useNavigation } from '@react-navigation/native'

import { useNavigationContext } from '@holi/core/navigation/context'

import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const navigationContext = useNavigationContext()
  const linkTo = useLinkTo()
  const navigation = useNavigation()
  const currentRoute = navigation.getState().routes[navigation.getState().index]

  const navigate = (routeName: string) => {
    navigationContext.setPathname(routeName)
    return linkTo(routeName)
  }

  return {
    navigate,
    navigateBack: (fallbackRouteName = '/') => {
      if (navigation.canGoBack()) {
        navigation.goBack()
      } else {
        navigate(fallbackRouteName)
      }
    },
    query: currentRoute.params as T,
    pathname: navigationContext.pathname,
  }
}

export default useRouting
