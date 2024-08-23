import { useRouter } from 'next/router'
import { useCallback } from 'react'

import { HoliNavHistory } from '@holi/core/navigation/helpers/HoliNavHistory'

import { RoutingState } from './types'

const setParams = () => undefined

const getPrevRouteFromPath = (currentRoute: string) => {
  const routeList = currentRoute.split('/')
  routeList.pop()
  return routeList.join('/')
}

const useRouting = (): RoutingState => {
  const router = useRouter()

  const navigate = useCallback(
    (routeName: string) => {
      HoliNavHistory.add(routeName)
      router.push(routeName)
    },
    [router]
  )

  const replaceRoute = useCallback(
    (routeName: string) => {
      HoliNavHistory.replace(routeName)
      return router.replace(routeName)
    },
    [router]
  )

  const replaceHistory = useCallback(async (routeName: string) => {
    // https://developer.mozilla.org/docs/Web/API/History/replaceState
    HoliNavHistory.replace(routeName)
    window.history.replaceState({ ...window.history.state, url: routeName, as: routeName }, '', routeName)
    return true
  }, [])

  const navigateBack = useCallback(
    (fallbackRouteName = '/') => {
      HoliNavHistory.shift()

      if (HoliNavHistory.history.length > 0) {
        router.back()
      } else {
        navigate(getPrevRouteFromPath(router.asPath) || fallbackRouteName)
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
