import React, { useCallback, useEffect, useState } from 'react'

import { NavigationContext, initialScreenOptions } from './NavigationContext'

export const NavigationContextProvider = ({ children }: React.PropsWithChildren<unknown>) => {
  const [pathname, setPathname] = useState('/')
  const [redirectPath, setRedirect] = useState<string | null>(null)
  const [options, setOptions] = useState(initialScreenOptions)

  useEffect(() => {
    console.log('------------ [Provider] pathname is updated', pathname)
  }, [pathname])

  const setRedirectAfterLogin = useCallback(
    (url: string | null) => {
      console.log('------------ [Provider] setRedirectAfterLogin to', url, 'existing pathname:', pathname)
      setRedirect(url)
    },
    [pathname]
  )

  const clearRedirectAfterLogin = useCallback(() => {
    setRedirect(null)
  }, [])

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
