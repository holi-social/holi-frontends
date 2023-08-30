import NetInfo from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'

export const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener((state) => {
      if (typeof state.isConnected === 'boolean') {
        setIsOnline(state.isConnected)
      }
    })
    return unsubscribe
  }, [])

  return isOnline
}
