import { useLayoutEffect } from 'react'
import { NativeStackNavigationOptions } from 'react-native-screens/native-stack'

import { useNavigation } from '@react-navigation/native'
import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'

import type { HeaderProps } from './index'

type NavigtionProps = NativeStackScreenProps<HomeStackScreens>

const setNavigationHeader = (
  headerProps: HeaderProps,
  setHeaderTitle: (title: string) => void,
  setOptions: (options: NativeStackNavigationOptions) => void
) => {
  const headerOptions: NativeStackNavigationOptions = {}
  if (typeof headerProps.title === 'string') setHeaderTitle(headerProps.title)
  if (headerProps?.headerCenter) headerOptions.headerCenter = headerProps.headerCenter
  if (headerProps?.headerLeft) headerOptions.headerLeft = headerProps.headerLeft
  if (headerProps?.headerRight) headerOptions.headerRight = headerProps.headerRight
  setOptions?.(headerOptions)
}

const useNavigationHeader = (navigation: NavigtionProps['navigation'], headerProps: HeaderProps) => {
  const { setOptions } = useNavigation()
  const { setHeaderTitle } = useNavigationContext()

  useLayoutEffect(() => {
    // This duplicate call is to prevent from flickering
    setNavigationHeader(headerProps, setHeaderTitle, setOptions)

    const unsubscribeFocus = navigation?.addListener('focus', () => {
      setNavigationHeader(headerProps, setHeaderTitle, setOptions)
      return () => unsubscribeFocus
    })

    // Important: do not add dependency items here. They will cause too many event subscriptions
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ''
}

export default useNavigationHeader
