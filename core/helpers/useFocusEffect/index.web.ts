import { useEffect, useRef } from 'react'

export const useFocusEffect = (func: CallableFunction) => {
  const funcCalled = useRef(false)

  useEffect(() => {
    if (!funcCalled.current) {
      func()
      funcCalled.current = true
    }
  }, [func])
}
