import React, { createContext, useContext, useState } from 'react'

export type NavigationContextType = {
  pathname: string
  setPathname: (path: string) => void
  headerTitle: string
  setHeaderTitle: (title: string) => void
  showBackLink: boolean
  setShowBackLink: (showIt: boolean) => void
}

const NavigationContext = createContext<NavigationContextType>({
  pathname: '/',
  setPathname: () => null,
  headerTitle: '',
  setHeaderTitle: () => null,
  showBackLink: false,
  setShowBackLink: () => null,
})
export const useNavigationContext = () => useContext(NavigationContext)

export const NavigationContextProvider: React.FC = ({ children }) => {
  const [pathname, setPathname] = useState('/')
  const [headerTitle, setHeaderTitle] = useState('')
  const [showBackLink, setShowBackLink] = useState(false)
  return (
    <NavigationContext.Provider
      value={{ pathname, setPathname, headerTitle, setHeaderTitle, showBackLink, setShowBackLink }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
