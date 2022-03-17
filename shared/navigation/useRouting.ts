import { useNavigation, useLinkTo } from '@react-navigation/native'

const useRouting = <T extends Record<string, string>>() => {
  const linkTo = useLinkTo()
  const navigation = useNavigation()
  return {
    //  TODO typed routes via config?
    navigate: (routeName: string) => linkTo(routeName),
    query: navigation.getState().routes[navigation.getState().index].params as T,
  }
}

export default useRouting
