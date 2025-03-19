import { useRef } from 'react'

export const useRateLimit = <T, A extends unknown[]>(cb: (...args: A) => T | Promise<T>, timeout = 5000) => {
  const lastRefetchTime = useRef(0)

  return (...args: A): Promise<T | void> | void => {
    const now = Date.now()
    if (now - lastRefetchTime.current > timeout) {
      lastRefetchTime.current = now
      const result = cb(...args)

      // Ensure it always returns a Promise when needed
      if (result instanceof Promise) {
        return result
      }
      return Promise.resolve(result)
    }
  }
}
