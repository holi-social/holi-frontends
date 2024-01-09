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

  const replaceHistory = useCallback(async (routeName: string) => {
    // https://developer.mozilla.org/docs/Web/API/History/replaceState
    window.history.replaceState({ ...window.history.state, url: routeName, as: routeName }, '', routeName)
    return true
  }, [])

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
    replaceHistory,
    setParams,
  }
}

export default useRouting
