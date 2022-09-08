import React, { ReactNode, createContext, useCallback, useContext, useState } from 'react'

export type linkDirection = 'left' | 'down'
export type NavigationContextType = {
  pathname: string
  setPathname: (path: string) => void
  headerTitle: string
  setHeaderTitle: (title: string) => void
  showBackLink: boolean
  showDownLink: boolean
  clearBackLinks: () => void
  titleElement: () => ReactNode | undefined
  setTitleElement: (node: ReactNode) => void
  headerLeft: () => ReactNode | undefined
  setHeaderLeft: (node: ReactNode) => void
  headerRight: () => ReactNode | undefined
  setHeaderRight: (node: ReactNode) => void
}

const NavigationContext = createContext<NavigationContextType>({
  pathname: '/',
  setPathname: () => null,
  headerTitle: '',
  setHeaderTitle: () => null,
  showBackLink: false,
  showDownLink: false,
  clearBackLinks: () => null,
  titleElement: () => null,
  setTitleElement: () => null,
  headerLeft: () => null,
  setHeaderLeft: () => null,
  headerRight: () => null,
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
