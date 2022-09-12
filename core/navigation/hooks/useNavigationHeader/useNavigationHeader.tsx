import React, { useCallback } from 'react'
import { NativeStackNavigationOptions } from 'react-native-screens/native-stack'

import { useNavigation } from '@react-navigation/native'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'

import type { HeaderProps } from './index'

const useNavigationHeader = () => {
  const { setOptions } = useNavigation()
  const { setHeaderTitle } = useNavigationContext()

  const setNavigationHeader = useCallback(
    (title: string, headerProps?: HeaderProps) => {
      const headerOptions: NativeStackNavigationOptions = {}
      setHeaderTitle(title)
      headerOptions.headerCenter = () => (
        <HoliText bold style={{ paddingTop: 5 }}>
          {title}
        </HoliText>
      )
      if (headerProps?.headerLeft) headerOptions.headerLeft = headerProps.headerLeft
      if (headerProps?.headerRight) headerOptions.headerRight = headerProps.headerRight
      setOptions?.(headerOptions)
    },
    [setOptions, setHeaderTitle]
  )

  const clearNavigationHeader = useCallback(() => {
    const headerOptions: NativeStackNavigationOptions = {}
    headerOptions.headerCenter = undefined
    headerOptions.headerLeft = undefined
    headerOptions.headerRight = undefined
    setOptions?.(headerOptions)
  }, [setOptions])

  return {
    setNavigationHeader,
    clearNavigationHeader,
  }
}

export default useNavigationHeader
