import { useEffect } from 'react'
import { BackHandler } from 'react-native'

const usePreventBackNavigation = (condition?: boolean) => {
  useEffect(() => {
    const listener = () => condition === true

    const subscription = BackHandler.addEventListener('hardwareBackPress', listener)

    return () => {
      subscription.remove() // ✅ correct way to remove
    }
  }, [condition])

  return null
}

export default usePreventBackNavigation
