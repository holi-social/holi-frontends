import { useCallback, useRef } from 'react'

import useIsomorphicLayoutEffect from '@holi/core/helpers/useIsomorphicLayoutEffect'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const useSafeDispatch = (dispatch: (...args: any[]) => any) => {
  const mounted = useRef(false)

  useIsomorphicLayoutEffect(() => {
    mounted.current = true
    return () => {
      mounted.current = false
    }
  }, [])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return useCallback((...args: any[]) => (mounted.current ? dispatch(...args) : void 0), [dispatch])
}
