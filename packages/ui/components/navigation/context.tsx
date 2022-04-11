import React, { useState, createContext, useContext } from 'react'

export type NavigationContextType = {
  pathname: string
  setPathname: (path: string) => void
  drawerIsOpen: boolean
  toggleDrawerIsOpen: () => void
}

const NavigationContext = createContext<NavigationContextType>({
  pathname: '/',
  setPathname: () => null,
  drawerIsOpen: false,
  toggleDrawerIsOpen: () => null,
})
export const useNavigationContext = () => useContext(NavigationContext)

export const NavigationContextProvider: React.FC = ({ children }) => {
  const [drawerIsOpen, setDrawerIsOpen] = useState(false)
  const toggleDrawerIsOpen = () => {
    setDrawerIsOpen(!drawerIsOpen)
  }

  // FIXME: breaks for root layout (drawer navigator) after hot reload, requires app reloadr
  const [pathname, setPathname] = useState('/')
  return (
    <NavigationContext.Provider value={{ pathname, setPathname, drawerIsOpen, toggleDrawerIsOpen }}>
      {children}
    </NavigationContext.Provider>
  )
}
