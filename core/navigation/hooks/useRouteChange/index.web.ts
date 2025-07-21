import { useEffect } from 'react'
import { useRouter } from 'next/router'

import type { OnRouteChangeCallback } from './types'

export const useRouteChange = (onRouteChange: OnRouteChangeCallback) => {
  const router = useRouter()

  useEffect(() => {
    router.events.on('routeChangeComplete', onRouteChange)

    return () => {
      router.events.off('routeChangeComplete', onRouteChange)
    }
  }, [router, onRouteChange])
}
