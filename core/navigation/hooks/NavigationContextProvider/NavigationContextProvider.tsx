import React, { useState } from 'react'

import { NavigationContext, initialScreenOptions } from './NavigationContext'

export const NavigationContextProvider: React.FC = ({ children }) => {
  const [pathname, setPathname] = useState('/')
  const [options, setOptions] = useState(initialScreenOptions)

  return (
    <NavigationContext.Provider
      value={{
        pathname,
        setPathname,
        options,
        setOptions,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
