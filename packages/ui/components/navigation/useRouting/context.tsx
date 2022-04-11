import React, { useState, createContext, useContext } from 'react'

const NavigationContext = createContext<{
  pathname: string
  setPathname: (path: string) => void
  drawerIsOpen: boolean
  toggleDrawerIsOpen: () => void
}>({
  pathname: '/',
  setPathname: () => null,
  drawerIsOpen: false,
  toggleDrawerIsOpen: () => null,
})

export const NavigationContextProvider: React.FC = ({ children }) => {
  // is needed in web context
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
export const useNavigationContext = () => useContext(NavigationContext)
