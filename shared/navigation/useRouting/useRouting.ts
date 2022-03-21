import { useNavigation, useLinkTo } from '@react-navigation/native'
import { UseRouting } from './types'

const useRouting: UseRouting = <T extends Record<string, string>>() => {
  const linkTo = useLinkTo()
  const navigation = useNavigation()
  const currentRoute = navigation.getState().routes[navigation.getState().index]

  return {
    navigate: (routeName: string) => linkTo(routeName),
    query: currentRoute.params as T,
    pathname: currentRoute.path || '/',
  }
}

export default useRouting
