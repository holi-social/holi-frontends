import { useEffect } from 'react'
import { BackHandler } from 'react-native'

const usePreventBackNavigation = (condition?: boolean) => {
  useEffect(() => {
    const listener = () => {
      return condition
    }
    BackHandler.addEventListener('hardwareBackPress', listener)

    return () => BackHandler.removeEventListener('hardwareBackPress', listener)
  }, [condition])

  return null
}

export default usePreventBackNavigation
