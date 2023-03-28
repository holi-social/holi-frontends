import React, { useState } from 'react'

import { NavigationContext, initialScreenOptions } from './NavigationContext'

export const NavigationContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [pathname, setPathname] = useState('/')
  const [redirectPath, setRedirect] = useState<string | null>(null)
  const [options, setOptions] = useState(initialScreenOptions)

  const setRedirectAfterLogin = (url: string | null) => setRedirect(url)

  const clearRedirectAfterLogin = () => setRedirect(null)

  return (
    <NavigationContext.Provider
      value={{
        pathname,
        setPathname,
        redirectPath,
        setRedirectAfterLogin,
        clearRedirectAfterLogin,
        options,
        setOptions,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
