import { makeVar, useReactiveVar } from '@apollo/client'
import { useCallback, useEffect } from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'

const pathToRedirect = makeVar<string | null>(null)
export const setPathToRedirect = pathToRedirect
export const usePathToRedirect = () => useReactiveVar(pathToRedirect)

export const useRedirect = (fallback?: string) => {
  const pathToRedirect = usePathToRedirect() ?? fallback
  const { navigate, replaceRoute } = useRouting()

  // Reset `pathToRedirect` on component destroy
  useEffect(() => {
    return () => {
      setPathToRedirect(null)
    }
  }, [])

  return useCallback(
    (replace?: boolean) => {
      if (pathToRedirect) {
        if (replace) {
          replaceRoute(pathToRedirect)
        } else {
          navigate(pathToRedirect)
        }
      }
    },
    [navigate, pathToRedirect, replaceRoute]
  )
}
