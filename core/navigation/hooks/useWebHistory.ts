import { useCallback } from 'react'

// Only exposed for testing
export const history: string[] = []

export const useWebHistory = () => {
  const push = useCallback((routeName: string) => {
    history.push(routeName)
  }, [])

  const replace = useCallback((routeName: string) => {
    history.pop()
    history.push(routeName)
  }, [])

  const back = useCallback((currentPathName: string, fallbackRouteName?: string) => {
    history.pop() // Remove current route
    if (history.length) {
      return undefined // Use default behaviour
    }
    if (fallbackRouteName) {
      return fallbackRouteName
    }
    const subpathIndex = currentPathName.lastIndexOf('/')
    const parentPath = currentPathName.substring(0, subpathIndex)
    return parentPath || '/'
  }, [])

  return {
    push,
    replace,
    back,
  }
}
