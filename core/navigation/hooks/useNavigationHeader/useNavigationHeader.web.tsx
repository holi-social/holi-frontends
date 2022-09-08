import { useCallback } from 'react'

import { useNavigationContext } from '@holi/core/navigation/NavigationContextProvider'

import { HeaderProps } from './index'

const useNavigationHeader = () => {
  const { setHeaderTitle, setTitleElement, setHeaderRight, setHeaderLeft, clearBackLinks } = useNavigationContext()

  const setNavigationHeader = useCallback(
    (headerProps: HeaderProps) => {
      const title = headerProps.title || ''
      setHeaderTitle(title)
      if (headerProps.titleElement) setTitleElement(headerProps.titleElement)
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
