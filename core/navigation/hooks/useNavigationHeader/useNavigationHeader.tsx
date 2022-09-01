import React from 'react'
import { NativeStackNavigationOptions } from 'react-native-screens/native-stack'

import { useNavigation } from '@react-navigation/native'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'

import type { HeaderProps } from './index'

const useNavigationHeader = () => {
  const navigation = useNavigation()
  const navigationContext = useNavigationContext()

  return {
    setNavigationHeader: (title: string, headerProps?: HeaderProps) => {
      const headerOptions: NativeStackNavigationOptions = {}
      navigationContext.setHeaderTitle(title)
      headerOptions.headerCenter = () => (
        <HoliText bold style={{ paddingTop: 5 }}>
          {title}
        </HoliText>
      )
      if (headerProps?.headerLeft) headerOptions.headerLeft = headerProps.headerLeft
      if (headerProps?.headerRight) headerOptions.headerRight = headerProps.headerRight
      navigation.setOptions?.(headerOptions)
    },
    clearNavigationHeader: () => {
      const headerOptions: NativeStackNavigationOptions = {}
      headerOptions.headerCenter = undefined
      headerOptions.headerLeft = undefined
      headerOptions.headerRight = undefined
      navigation.setOptions?.(headerOptions)
    },
  }
}

export default useNavigationHeader
