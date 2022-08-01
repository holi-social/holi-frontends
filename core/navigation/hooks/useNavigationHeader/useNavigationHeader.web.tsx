import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'

import { HeaderProps } from './index'

const useNavigationHeader = () => {
  const navigationContext = useNavigationContext()

  return {
    setNavigationHeader: (headerProps: HeaderProps) => {
      const title = headerProps.title || ''
      navigationContext.setHeaderTitle(title)
      if (headerProps.titleElement) navigationContext.setTitleElement(headerProps.titleElement)
      if (headerProps.headerRight) navigationContext.setHeaderRight(headerProps.headerRight)
      if (headerProps.headerLeft) navigationContext.setHeaderLeft(headerProps.headerLeft)
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
