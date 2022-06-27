import { useLayoutEffect } from 'react'
import { NativeStackNavigationOptions } from 'react-native-screens/native-stack'

import { useNavigation } from '@react-navigation/native'

import { HeaderProps } from './index'

const useNavigationHeader = () => {
  const navigation = useNavigation()

  // https://github.com/react-navigation/react-navigation/blob/main/packages/elements/src/types.tsx
  const headerOptions: NativeStackNavigationOptions = {}

  useLayoutEffect(() => navigation.setOptions(headerOptions), [navigation])

  return {
    setNavigationHeader: (headerProps: HeaderProps) => {
      if (headerProps.titleElement) headerOptions.headerTitle = headerProps.titleElement
      if (headerProps.leftElement) headerOptions.headerLeft = headerProps.leftElement
      if (headerProps.rightElement) headerOptions.headerRight = headerProps.rightElement
    },
  }
}

export default useNavigationHeader
