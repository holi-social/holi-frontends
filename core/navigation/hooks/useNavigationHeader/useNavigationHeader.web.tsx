import React, {useCallback } from 'react'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'

import { HeaderProps } from './index'

const useNavigationHeader = () => {
  const { setHeaderTitle, setTitleElement, setHeaderRight, setHeaderLeft, clearBackLinks } = useNavigationContext()

  const setNavigationHeader = useCallback(
    (title: string, headerProps: HeaderProps) => {
      setHeaderTitle(title)
      setTitleElement(() => (
        <HoliText bold style={{ paddingTop: 5 }}>
          {title}
        </HoliText>
      ))
      if (headerProps.headerRight) setHeaderRight(headerProps.headerRight)
      if (headerProps.headerLeft) setHeaderLeft(headerProps.headerLeft)
    },
    [setHeaderTitle, setTitleElement, setHeaderRight, setHeaderLeft]
  )

  const clearNavigationHeader = useCallback(() => {
    clearBackLinks()
    setTitleElement(undefined)
    setHeaderRight(undefined)
    setHeaderLeft(undefined)
  }, [setTitleElement, setHeaderRight, setHeaderLeft, clearBackLinks])

  return {
    setNavigationHeader,
    clearNavigationHeader,
  }
}

export default useNavigationHeader
