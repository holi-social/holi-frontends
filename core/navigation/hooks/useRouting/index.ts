import { useCallback } from 'react'
import { useRouter, usePathname, useGlobalSearchParams } from 'expo-router'
import { setPathname } from '@holi/core/navigation/hooks/usePathname'
import type { RoutingState } from './types'

const useRouting = (): RoutingState => {
  const router = useRouter()
  const pathname = usePathname()
  const currentParams = useGlobalSearchParams()

  const navigate = useCallback(
    (path: string) => {
      setPathname(path)
      router.push(path)
    },
    [router]
  )

  const navigateBack = useCallback(
    (pathName = '/') => {
      try {
        router.back()
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
