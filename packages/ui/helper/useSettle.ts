import { useCallback, useRef } from 'react'

export const useSettle = (fn: (value: number) => void, ms: number) => {
  const lastValueRef = useRef<number | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  return useCallback(
    (value: number) => {
      clearTimeout(timeout.current)
      if (value != lastValueRef.current) {
        timeout.current = setTimeout(() => {
          if (fn) fn(value)
        }, ms)
      } else {
        // Immediately invoke function if value did not change
        if (fn) fn(value)
      }
      lastValueRef.current = value
    },
    [fn, ms]
  )
}
