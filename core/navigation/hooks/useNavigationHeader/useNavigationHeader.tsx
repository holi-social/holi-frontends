import { useCallback } from 'react'
import { NativeStackNavigationOptions } from 'react-native-screens/native-stack'

import { useNavigation } from '@react-navigation/native'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'

import type { HeaderProps } from './index'

const useNavigationHeader = () => {
  const { setOptions } = useNavigation()
  const { setHeaderTitle } = useNavigationContext()

  const setNavigationHeader = useCallback(
    (headerProps: HeaderProps) => {
      const headerOptions: NativeStackNavigationOptions = {}
      const title = headerProps.title || ''
      setHeaderTitle(title)
      if (headerProps.titleElement) headerOptions.titleElement = headerProps.titleElement
      if (headerProps.headerLeft) headerOptions.headerLeft = headerProps.headerLeft
      if (headerProps.headerRight) headerOptions.headerRight = headerProps.headerRight
      setOptions?.(headerOptions)
    },
    [setOptions, setHeaderTitle]
  )

  const clearNavigationHeader = useCallback(() => {
    const headerOptions: NativeStackNavigationOptions = {}
    headerOptions.titleElement = undefined
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
