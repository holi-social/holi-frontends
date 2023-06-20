import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { RoutingState } from './types'

const setParams = () => undefined

const useRouting = (): RoutingState => {
  const router = useRouter()

  const navigate = useCallback(
    (routeName: string) => {
      router.push(routeName)
    },
    [router]
  )

  const replaceRoute = useCallback((routeName: string) => router.replace(routeName), [router])

  const navigateBack = useCallback(
    (fallbackRouteName = '/') => {
      if (window.history.length) {
        router.back()
      } else {
        navigate(fallbackRouteName)
      }
    },
    [router, navigate]
  )

  return {
    navigate,
    navigateBack,
    replaceRoute,
    setParams,
  }
}

export default useRouting
