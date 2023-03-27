import React, { useCallback, useState } from 'react'

import { NavigationContext, initialScreenOptions } from './NavigationContext'

export const NavigationContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [pathname, setPathname] = useState('/')
  const [redirectPath, setRedirect] = useState<string | null>(null)
  const [options, setOptions] = useState(initialScreenOptions)

  const clearRedirectAfterLogin = useCallback(() => setRedirect(null), [])

  return (
    <NavigationContext.Provider
      value={{
        pathname,
        setPathname,
        redirectPath,
        setRedirectAfterLogin: setRedirect,
        clearRedirectAfterLogin,
        options,
        setOptions,
      }}
    >
      {children}
    </NavigationContext.Provider>
  )
}
