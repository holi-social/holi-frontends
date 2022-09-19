import { useLayoutEffect } from 'react'

import type { NativeStackScreenProps } from '@react-navigation/native-stack'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import type { HomeStackScreens } from '@holi/mobile/navigation/RootNavigator'

import type { HeaderProps } from './index'

type NavigtionProps = NativeStackScreenProps<HomeStackScreens>

const useNavigationHeader = (navigation: NavigtionProps['navigation'], headerProps: HeaderProps) => {
  const { setHeaderTitle, setHeaderRight, setHeaderLeft, setTitleElement, clearBackLinks } = useNavigationContext()

  useLayoutEffect(() => {
    if (headerProps.title) setHeaderTitle(headerProps.title)
    if (headerProps.headerRight) setTitleElement(headerProps.headerCenter)
    if (headerProps.headerRight) setHeaderRight(headerProps.headerRight)
    if (headerProps.headerLeft) setHeaderLeft(headerProps.headerLeft)

    return () => {
      clearBackLinks()
      setTitleElement(undefined)
      setHeaderLeft(undefined)
      setHeaderRight(undefined)
    }

    // Important: do not add dependencies here. Would cause endless loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  return ''
}

export default useNavigationHeader
