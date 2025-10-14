import { useEffect } from 'react'
import { BackHandler } from 'react-native'

const usePreventBackNavigation = (condition?: boolean) => {
  useEffect(() => {
    const handler = () => {
      return condition
    }
    const listener = BackHandler.addEventListener('hardwareBackPress', handler)

    return () => listener.remove()
  }, [condition])

  return null
}

export default usePreventBackNavigation
