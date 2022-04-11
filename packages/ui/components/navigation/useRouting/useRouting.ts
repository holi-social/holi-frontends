import { useNavigation, useLinkTo, DrawerActions } from '@react-navigation/native'
import { useNavigationContext } from '@holi/ui/components/navigation/useRouting/context'
import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const navigationContext = useNavigationContext()
  const linkTo = useLinkTo()
  const navigation = useNavigation()
  const currentRoute = navigation.getState().routes[navigation.getState().index]

  const someFunc = () => {
    console.log('useRouting: toggleDrawer: ', navigationContext.drawerIsOpen)
    navigation.dispatch(DrawerActions.toggleDrawer())
  }

  return {
    navigate: (routeName: string) => {
      navigationContext.setPathname(routeName)
      return linkTo(routeName)
    },
    toggleDrawer: someFunc,
    query: currentRoute.params as T,
    pathname: navigationContext.pathname,
  }
}

export default useRouting
