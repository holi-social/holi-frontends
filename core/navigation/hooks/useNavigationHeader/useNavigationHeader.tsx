import { NativeStackNavigationOptions } from 'react-native-screens/native-stack'

import { useNavigation } from '@react-navigation/native'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'

import type { HeaderProps } from './index'

const useNavigationHeader = () => {
  const navigation = useNavigation()
  const navigationContext = useNavigationContext()

  return {
    setNavigationHeader: (headerProps: HeaderProps) => {
      const headerOptions: NativeStackNavigationOptions = {}
      const title = headerProps.title || ''
      navigationContext.setHeaderTitle(title)
      if (headerProps.titleElement) headerOptions.titleElement = headerProps.titleElement
      if (headerProps.leftElement) headerOptions.headerLeft = headerProps.leftElement
      if (headerProps.rightElement) headerOptions.headerRight = headerProps.rightElement
      navigation.setOptions && navigation.setOptions(headerOptions)
    },
    clearNavigationHeader: () => {
      const headerOptions: NativeStackNavigationOptions = {}
      headerOptions.titleElement = undefined
      headerOptions.headerLeft = undefined
      headerOptions.headerRight = undefined
      navigation.setOptions && navigation.setOptions(headerOptions)
    },
  }
}

export default useNavigationHeader
