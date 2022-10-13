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
  titleElement: ReactElement | undefined
  setTitleElement: (node: ReactElement) => void
  headerLeft: ReactElement | undefined
  setHeaderLeft: (node: ReactElement) => void
  headerRight: ReactElement | undefined
  setHeaderRight: (node: ReactElement) => void
}

const NavigationContext = createContext<NavigationContextType>({
  pathname: '/',
  setPathname: () => null,
  headerTitle: '',
  setHeaderTitle: () => null,
  showBackLink: false,
  showDownLink: false,
  clearBackLinks: () => null,
  titleElement: undefined,
  setTitleElement: () => null,
  headerLeft: undefined,
  setHeaderLeft: () => null,
  headerRight: undefined,
  setHeaderRight: () => null,
})
NavigationContext.displayName = 'NavigationContext'

export const useNavigationContext = () => useContext(NavigationContext)

const NavigationContextProvider: React.FC = ({ children }) => {
  const [pathname, setPathname] = useState('/')
  const [headerTitle, setHeaderTitle] = useState('')
  const [showBackLink, setShowBackLink] = useState(false)
  const [showDownLink, setShowDownLink] = useState(false)
  const [titleElement, setTitleElement] = useState(null)
  const [headerLeft, setHeaderLeft] = useState(null)
  const [headerRight, setHeaderRight] = useState(null)

  const clearBackLinks = useCallback(() => {
    setShowBackLink(false)
    setShowDownLink(false)
    setHeaderTitle('')
    setTitleElement(null)
    setHeaderLeft(null)
    setHeaderRight(null)
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
