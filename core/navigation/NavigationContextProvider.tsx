import React, { ReactElement, createContext, useCallback, useContext, useState } from 'react'

export type linkDirection = 'left' | 'down'
export type NavigationContextType = {
  pathname: string
  setPathname: (path: string) => void
  headerTitle: string
  setHeaderTitle: (title: string) => void
  showBackLink: boolean
  showDownLink: boolean
  clearBackLinks: () => void
  titleElement?: ReactElement
  setTitleElement: (node?: ReactElement) => void
  headerLeft?: ReactElement
  setHeaderLeft: (node?: ReactElement) => void
  headerRight?: ReactElement
  setHeaderRight: (node?: ReactElement) => void
}

const NavigationContext = createContext<NavigationContextType>({
  pathname: '/',
  setPathname: () => null,
  headerTitle: '',
  setHeaderTitle: () => null,
  showBackLink: false,
  showDownLink: false,
  clearBackLinks: () => null,
  setTitleElement: () => null,
  setHeaderLeft: () => null,
  setHeaderRight: () => null,
})
NavigationContext.displayName = 'NavigationContext'

export const useNavigationContext = () => useContext(NavigationContext)

const NavigationContextProvider: React.FC = ({ children }) => {
  const [pathname, setPathname] = useState('/')
  const [headerTitle, setHeaderTitle] = useState('')
  const [showBackLink, setShowBackLink] = useState(false)
  const [showDownLink, setShowDownLink] = useState(false)
  const [titleElement, setTitleElement] = useState<ReactElement>()
  const [headerLeft, setHeaderLeft] = useState<ReactElement>()
  const [headerRight, setHeaderRight] = useState<ReactElement>()

  const clearBackLinks = useCallback(() => {
    setShowBackLink(false)
    setShowDownLink(false)
    setHeaderTitle('')
    setTitleElement(undefined)
    setHeaderLeft(undefined)
    setHeaderRight(undefined)
  }, [])

  return (
    <NavigationContext.Provider
      value={{
        pathname,
        setPathname,
        headerTitle,
        setHeaderTitle,
        showBackLink,
        showDownLink,
        clearBackLinks,
        titleElement,
        setTitleElement,
        headerLeft,
        setHeaderLeft,
        headerRight,
        setHeaderRight,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}

export default NavigationContextProvider
