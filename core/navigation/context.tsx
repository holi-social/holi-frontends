import React, { createContext, useContext, useState } from 'react'

export type NavigationContextType = {
  pathname: string
  setPathname: (path: string) => void
  headerTitle: string
  setHeaderTitle: (title: string) => void
}

const NavigationContext = createContext<NavigationContextType>({
  pathname: '/',
  setPathname: () => null,
  headerTitle: '',
  setHeaderTitle: () => null,
})
export const useNavigationContext = () => useContext(NavigationContext)

export const NavigationContextProvider: React.FC = ({ children }) => {
  const [pathname, setPathname] = useState('/')
  const [headerTitle, setHeaderTitle] = useState('')
  return (
    <NavigationContext.Provider value={{ pathname, setPathname, headerTitle, setHeaderTitle }}>
      {children}
    </NavigationContext.Provider>
  )
}
