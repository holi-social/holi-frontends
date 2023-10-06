import NetInfo from '@react-native-community/netinfo'
import { useEffect, useState } from 'react'

export const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    const unsubscribe = NetInfo.addEventListener(({ isConnected }) => {
      if (isConnected === null) return
      setIsOnline(isConnected)
    })
    return unsubscribe
  }, [])

  return isOnline
}
