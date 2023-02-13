import { useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (props: Record<string, any>) => void
export const useDelayed = (fn: T) => {
  const funcRef = useRef<T | null>(null)
  funcRef.current = fn

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const start = (props: Record<string, any>, timeout: number) => {
    const startTime = Date.now()
    const intervalId = setInterval(() => {
      const now = Date.now()
      const diff = now - startTime
      if (diff > timeout) {
        clearInterval(intervalId)
        requestAnimationFrame(() => funcRef?.current?.(props))
      }
    }, 100)
  }

  return start
}
