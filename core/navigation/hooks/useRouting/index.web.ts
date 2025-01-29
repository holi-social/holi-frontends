import { useRouter } from 'next/router'
import { useCallback } from 'react'

import type { RoutingState } from './types'

import { useWebHistory } from '@holi/core/navigation/hooks/useWebHistory'

const setParams = () => undefined

const useRouting = (): RoutingState => {
  const router = useRouter()
  const history = useWebHistory()

  const navigate = useCallback(
    (routeName: string) => {
      history.push(routeName)
      router.push(routeName)
    },
    [history, router]
  )

  const replaceRoute = useCallback(
    (routeName: string) => {
      history.replace(routeName)
      return router.replace(routeName)
    },
    [router, history]
  )

  const replaceHistory = useCallback(
    async (routeName: string) => {
      history.replace(routeName)
      // https://developer.mozilla.org/docs/Web/API/History/replaceState
      window.history.replaceState({ ...window.history.state, url: routeName, as: routeName }, '', routeName)
      return true
    },
    [history]
  )

  const navigateBack = useCallback(
    (fallbackRouteName?: string) => {
      const newRouteName = history.back(router.asPath, fallbackRouteName)
      if (newRouteName) {
        navigate(newRouteName)
      } else {
        router.back()
      }
    },
    [history, router, navigate]
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
