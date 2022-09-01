import React from 'react'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'
import HoliText from '@holi/ui/components/atoms/HoliText'

import { HeaderProps } from './index'

const useNavigationHeader = () => {
  const navigationContext = useNavigationContext()

  return {
    setNavigationHeader: (title: string, headerProps?: HeaderProps) => {
      navigationContext.setHeaderTitle(title)
      navigationContext.setTitleElement(() => (
        <HoliText bold style={{ paddingTop: 5 }}>
          {title}
        </HoliText>
      ))
      if (headerProps?.headerRight) navigationContext.setHeaderRight(headerProps.headerRight)
      if (headerProps?.headerLeft) navigationContext.setHeaderLeft(headerProps.headerLeft)
    },
    clearNavigationHeader: () => {
      navigationContext.clearBackLinks()
      navigationContext.setTitleElement(undefined)
      navigationContext.setHeaderRight(undefined)
      navigationContext.setHeaderLeft(undefined)
    },
  }
}

export default useNavigationHeader
