import { useEffect, useState } from 'react'

export const useIsOnline = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine)

  useEffect(() => {
    function onlineHandler() {
      setIsOnline(true)
    }

    function offlineHandler() {
      setIsOnline(false)
    }

    window.addEventListener('online', onlineHandler)
    window.addEventListener('offline', offlineHandler)

    return () => {
      window.removeEventListener('online', onlineHandler)
      window.removeEventListener('offline', offlineHandler)
    }
  }, [])

  return isOnline
}
