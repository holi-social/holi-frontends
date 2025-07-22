import { useEffect, useRef } from 'react'

export const useFocusEffect = (func: CallableFunction) => {
  const initiallyCalled = useRef(false)

  useEffect(() => {
    // Call the function only once when the component mounts
    if (!initiallyCalled.current) {
      func()
      initiallyCalled.current = true
    }

    // Call the function when the browser tab gets focused
    const handler = () => {
      if (document.hidden === false) {
        func()
      }
    }

    document.addEventListener('visibilitychange', handler)

    return () => {
      document.removeEventListener('visibilitychange', handler)
    }
  }, [func])
}
