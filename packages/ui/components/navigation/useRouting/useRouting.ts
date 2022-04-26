import { DrawerActions, useLinkTo, useNavigation } from '@react-navigation/native'

import { useNavigationContext } from '@holi/ui/components/navigation/context'

import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const navigationContext = useNavigationContext()
  const linkTo = useLinkTo()
  const navigation = useNavigation()
  const currentRoute = navigation.getState().routes[navigation.getState().index]

  return {
    navigate: (routeName: string) => {
      navigationContext.setPathname(routeName)
      return linkTo(routeName)
    },
    toggleDrawer: () => navigation.dispatch(DrawerActions.toggleDrawer()),
    query: currentRoute.params as T,
    pathname: navigationContext.pathname,
  }
}

export default useRouting
