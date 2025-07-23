import { makeVar, useReactiveVar } from '@apollo/client'
import { useCallback, useEffect } from 'react'

import useRouting from '@holi/core/navigation/hooks/useRouting'

const pathToRedirect = makeVar<string | null>(null)
export const setPathToRedirect = pathToRedirect
export const usePathToRedirect = () => useReactiveVar(pathToRedirect)

export const useRedirect = (fallback?: string) => {
  const storedPath = usePathToRedirect()
  const { navigate, replaceRoute } = useRouting()

  useEffect(() => {
    return () => {
      setPathToRedirect(null)
    }
  }, [])

  return useCallback(
    (replace?: boolean) => {
      const targetPath = storedPath || fallback

      if (targetPath) {
        if (replace) {
          replaceRoute(targetPath)
        } else {
          navigate(targetPath)
        }
        // Clear the stored path after navigation
        setPathToRedirect(null)
      }
    },
    [navigate, replaceRoute, storedPath, fallback]
  )
}
