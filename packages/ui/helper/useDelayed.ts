import { useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (...args: any[]) => void
export const useDelayed = (fn: T, timeout: number) => {
  const funcRef = useRef<T | null>(null)
  funcRef.current = fn
  const startTime = Date.now()

  const start = (...args: Parameters<T>) => {
    const intervalId = setInterval(() => {
      const now = Date.now()
      const diff = now - startTime
      if (diff > timeout) {
        clearInterval(intervalId)
        requestAnimationFrame(() => funcRef?.current?.(...args))
      }
    }, 100)
  }

  return start
}
