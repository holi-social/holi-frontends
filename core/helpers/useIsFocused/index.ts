import { useNavigation } from 'expo-router'

export const useIsFocused = (): boolean => {
  const navigation = useNavigation()
  return navigation.isFocused()
}
