import { makeVar, useReactiveVar } from '@apollo/client'

// Only exposed for testing
export const historyVar = makeVar<string[]>([])

export const useWebHistory = () => {
  const history = useReactiveVar(historyVar)

  const push = (routeName: string) => {
    history.push(routeName)
  }

  const replace = (routeName: string) => {
    history.pop()
    history.push(routeName)
  }

  const back = (currentPathName: string, fallbackRouteName?: string) => {
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
  }

  return {
    push,
    replace,
    back,
  }
}
