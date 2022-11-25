import debounce from 'lodash.debounce'
import { useMemo, useRef } from 'react'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type T = (...args: any[]) => void
export const useDebounce = (fn: T, ms: number, maxWait?: number) => {
  const funcRef = useRef<T | null>(null)
  funcRef.current = fn

  return useMemo(
    () =>
      debounce(
        (...args: Parameters<T>) => {
          if (funcRef.current) {
            funcRef.current(...args)
          }
        },
        ms,
        { maxWait }
      ),
    [ms, maxWait]
  )
}
