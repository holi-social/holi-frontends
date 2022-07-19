import React, { createContext, useContext, useState } from 'react'

export type linkDirection = 'left' | 'down'
export type NavigationContextType = {
  pathname: string
  setPathname: (path: string) => void
  headerTitle: string
  setHeaderTitle: (title: string) => void
  showBackLink: boolean
  showDownLink: boolean
  setBackLink: (direction: linkDirection) => void
  clearBackLinks: () => void
}

const NavigationContext = createContext<NavigationContextType>({
  pathname: '/',
  setPathname: () => null,
  headerTitle: '',
  setHeaderTitle: () => null,
  showBackLink: false,
  showDownLink: false,
  setBackLink: () => null,
  clearBackLinks: () => null,
})
export const useNavigationContext = () => useContext(NavigationContext)

export const NavigationContextProvider: React.FC = ({ children }) => {
  const [pathname, setPathname] = useState('/')
  const [headerTitle, setHeaderTitle] = useState('')
  const [showBackLink, setShowBackLink] = useState(false)
  const [showDownLink, setShowDownLink] = useState(false)

  const setBackLink = (direction: linkDirection) => {
    switch (direction) {
      case 'left':
        setShowBackLink(true)
        break
      case 'down':
        setShowDownLink(true)
        break
    }
  }

  const clearBackLinks = () => {
    setShowBackLink(false)
    setShowDownLink(false)
  }

  return (
    <NavigationContext.Provider
      value={{
        pathname,
        setPathname,
        headerTitle,
        setHeaderTitle,
        showBackLink,
        showDownLink,
        setBackLink,
        clearBackLinks,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
