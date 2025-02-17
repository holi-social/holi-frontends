// Only exposed for testing
export const history: string[] = []

export const useWebHistory = () => {
  const push = (routeName: string) => {
    history.push(routeName)
  }

  const replace = (routeName: string) => {
    history.pop()
    history.push(routeName)
  }

  const back = (currentPathName: string, fallbackRouteName?: string) => {
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
  }

  const syncInitialRoute = (pathName: string) => {
    if (!history.length) {
      push(pathName)
    }
  }

  return {
    push,
    replace,
    back,
    syncInitialRoute,
  }
}
