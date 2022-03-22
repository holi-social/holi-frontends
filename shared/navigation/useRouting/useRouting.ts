import { useNavigation, useLinkTo } from '@react-navigation/native'
import { useNavigationContext } from 'shared/navigation/useRouting/context'
import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const context = useNavigationContext()
  const linkTo = useLinkTo()
  const navigation = useNavigation()
  const currentRoute = navigation.getState().routes[navigation.getState().index]

  return {
    navigate: (routeName: string) => {
      console.log('[useRouting] navigate to ', routeName)
      context.setPathname(routeName)
      console.log('[useRouting] context pathname is set to', context, 'now linkTo ...')
      return linkTo(routeName)
    },
    query: currentRoute.params as T,
    pathname: context.pathname,
  }
}

export default useRouting
