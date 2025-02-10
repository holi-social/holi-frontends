import { useRouter } from 'next/router'
import { useCallback } from 'react'

import type { RoutingState } from './types'

import { useWebHistory } from '@holi/core/navigation/hooks/useWebHistory'

const setParams = () => undefined

const useRouting = (): RoutingState => {
  const router = useRouter()
  const { push, replace, back } = useWebHistory()

  const navigate = useCallback(
    (routeName: string) => {
      push(routeName)
      router.push(routeName)
    },
    [push, router]
  )

  const replaceRoute = useCallback(
    (routeName: string) => {
      replace(routeName)
      return router.replace(routeName)
    },
    [replace, router]
  )

  const replaceHistory = useCallback(
    async (routeName: string) => {
      replace(routeName)
      // https://developer.mozilla.org/docs/Web/API/History/replaceState
      window.history.replaceState({ ...window.history.state, url: routeName, as: routeName }, '', routeName)
      return true
    },
    [replace]
  )

  const navigateBack = useCallback(
    (fallbackRouteName?: string) => {
      const newRouteName = back(router.asPath, fallbackRouteName)
      if (newRouteName) {
        navigate(newRouteName)
      } else {
        router.back()
      }
    },
    [back, router, navigate]
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
