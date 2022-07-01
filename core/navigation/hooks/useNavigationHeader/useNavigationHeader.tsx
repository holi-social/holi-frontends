import { NativeStackNavigationOptions } from 'react-native-screens/native-stack'

import { useNavigation } from '@react-navigation/native'

import type { HeaderProps } from './index'

const useNavigationHeader = () => {
  const navigation = useNavigation()

  return {
    setNavigationHeader: (headerProps: HeaderProps) => {
      const headerOptions: NativeStackNavigationOptions = {}
      if (headerProps.titleElement) headerOptions.headerTitle = headerProps.titleElement
      if (headerProps.leftElement) headerOptions.headerLeft = headerProps.leftElement
      if (headerProps.rightElement) headerOptions.headerRight = headerProps.rightElement
      navigation.setOptions && navigation.setOptions(headerOptions)
    },
  }
}

export default useNavigationHeader
