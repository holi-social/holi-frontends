import { useNavigation, useLinkTo, DrawerActions } from '@react-navigation/native'
import { useNavigationContext } from '@holi/ui/components/navigation/useRouting/context'
import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const context = useNavigationContext()
  const linkTo = useLinkTo()
  const navigation = useNavigation()
  const currentRoute = navigation.getState().routes[navigation.getState().index]

  return {
    navigate: (routeName: string) => {
      context.setPathname(routeName)
      return linkTo(routeName)
    },
    query: currentRoute.params as T,
    pathname: context.pathname,
    toggleDrawer: navigation.dispatch(DrawerActions.toggleDrawer()),
  }
}

export default useRouting
