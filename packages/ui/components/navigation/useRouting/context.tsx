import React, { useState } from 'react'
import { createContext, useContext } from 'react'

const NavigationContext = createContext<{
  pathname: string
  setPathname: (path: string) => void
}>({
  pathname: '/',
  setPathname: () => null,
})

export const NavigationContextProvider: React.FC = ({ children }) => {
  // FIXME: breaks for root layout (drawer navigator) after hot reload, requires app reloadr
  const [pathname, setPathname] = useState('/')
  return <NavigationContext.Provider value={{ pathname, setPathname }}>{children}</NavigationContext.Provider>
}
export const useNavigationContext = () => useContext(NavigationContext)
