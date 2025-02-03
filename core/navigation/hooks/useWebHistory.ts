import { makeVar, useReactiveVar } from '@apollo/client'
import { useCallback } from 'react'

// Only exposed for testing
export const historyVar = makeVar<string[]>([])

export const useWebHistory = () => {
  const history = useReactiveVar(historyVar)

  const push = useCallback(
    (routeName: string) => {
      history.push(routeName)
    },
    [history]
  )

  const replace = useCallback(
    (routeName: string) => {
      history.pop()
      history.push(routeName)
    },
    [history]
  )

  const back = useCallback(
    (currentPathName: string, fallbackRouteName?: string) => {
      const historyLength = history.length
      history.pop()
      if (historyLength) {
        return undefined // Use default behaviour
      }
      if (fallbackRouteName) {
        return fallbackRouteName
      }
      const subpathIndex = currentPathName.lastIndexOf('/')
      const parentPath = currentPathName.substring(0, subpathIndex)
      return parentPath || '/'
    },
    [history]
  )

  return {
    push,
    replace,
    back,
  }
}
