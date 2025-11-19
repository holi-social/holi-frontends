import { useCallback, useRef, useEffect } from 'react'
import { useRouter, usePathname, useGlobalSearchParams } from 'expo-router'
import { setPathname } from '@holi/core/navigation/hooks/usePathname'
import type { RoutingState } from './types'

const PATH_CLEANUP_TIMER_DELAY = 400

const useRouting = (): RoutingState => {
  const router = useRouter()
  const pathname = usePathname()
  const currentParams = useGlobalSearchParams()
  const navigationInProgressRef = useRef<string | null>(null)
  const navigationTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
    }
  }, [])

  const navigate = useCallback(
    (path: string) => {
      if (navigationInProgressRef.current === path) {
        return
      }

      navigationInProgressRef.current = path

      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
      navigationTimeoutRef.current = setTimeout(() => {
        navigationInProgressRef.current = null
      }, PATH_CLEANUP_TIMER_DELAY)

      setPathname(path)
      router.push(path)
    },
    [router]
  )

  const navigateBack = useCallback(
    (pathName = '/') => {
      if (navigationInProgressRef.current !== null) {
        return
      }

      navigationInProgressRef.current = 'BACK'

      if (navigationTimeoutRef.current) {
        clearTimeout(navigationTimeoutRef.current)
      }
      navigationTimeoutRef.current = setTimeout(() => {
        navigationInProgressRef.current = null
      }, PATH_CLEANUP_TIMER_DELAY)

      try {
        if (router.canGoBack()) {
          router.back()
        } else {
          router.push(pathName)
        }
      } catch {
        router.push(pathName)
      }
      setPathname(pathName)
    },
    [router]
  )

  const replaceRoute = useCallback(
    async (path: string) => {
      setPathname(path)
      router.replace(path)
      return true
    },
    [router]
  )

  const setParams = useCallback(
    (params: Record<string, unknown>) => {
      const mergedParams = { ...currentParams, ...params }
      const search = new URLSearchParams(mergedParams as Record<string, string>).toString()
      router.replace(`${pathname}?${search}`)
    },
    [router, pathname, currentParams]
  )

  return {
    navigate,
    navigateBack,
    replaceRoute,
    replaceHistory: replaceRoute,
    setParams,
  }
}

export default useRouting
